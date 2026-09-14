import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '@prisma/client';
import { AuthenticatedUser } from '../../../../shared/domain/types/authenticated-user';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  organizationId: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario inválido o inactivo.');
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };
  }
}
