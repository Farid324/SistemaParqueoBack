import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { randomUUID } from 'crypto';
import { Rol } from '@prisma/client';
import { AuthTokens } from '../../domain/value-objects/auth-tokens.value-object';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { hashToken } from '../../infrastructure/security/token-hash.util';
import { JwtPayload } from '../../infrastructure/strategies/jwt.strategy';

const REFRESH_TOKEN_DAYS_FALLBACK = 30;

interface TokenSubject {
  id: string;
  email: string;
  role: Rol;
  organizationId?: string | null;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(IRefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  private buildPayload(user: TokenSubject): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId ?? null,
    };
  }

  async issueTokens(user: TokenSubject): Promise<AuthTokens> {
    const payload = this.buildPayload(user);

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m') as StringValue,
    });

    const refreshToken = randomUUID() + randomUUID();
    const refreshExpiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '30d');
    const expiresAt = this.addDuration(new Date(), refreshExpiresIn);

    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  async rotateRefreshToken(
    rawRefreshToken: string,
    userLookup: (userId: string) => Promise<TokenSubject | null>,
  ): Promise<AuthTokens> {
    const tokenHash = hashToken(rawRefreshToken);
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!stored || stored.revokedAt || stored.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('El refresh token es inválido o ha expirado.');
    }

    const user = await userLookup(stored.userId);
    if (!user) {
      throw new UnauthorizedException('El usuario ya no existe.');
    }

    await this.refreshTokenRepository.revoke(stored.id);
    return this.issueTokens(user);
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllForUser(userId);
  }

  generateEmailVerificationToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId, purpose: 'email-verification' },
      { expiresIn: '1d' },
    );
  }

  verifyEmailVerificationToken(token: string): string {
    let payload: { sub: string; purpose: string };
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('El token de verificación es inválido o ha expirado.');
    }

    if (payload.purpose !== 'email-verification') {
      throw new UnauthorizedException('El token de verificación es inválido.');
    }

    return payload.sub;
  }

  private addDuration(base: Date, duration: string): Date {
    const match = /^(\d+)([smhd])$/.exec(duration.trim());
    if (!match) {
      const fallback = new Date(base);
      fallback.setDate(fallback.getDate() + REFRESH_TOKEN_DAYS_FALLBACK);
      return fallback;
    }

    const value = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };

    return new Date(base.getTime() + value * multipliers[unit]);
  }
}
