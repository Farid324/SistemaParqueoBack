import { Injectable } from '@nestjs/common';
import {
  IRefreshTokenRepository,
  StoredRefreshToken,
} from '../../domain/repositories/refresh-token.repository.interface';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { userId: string; tokenHash: string; expiresAt: Date }): Promise<void> {
    await this.prisma.tokenRenovacion.create({
      data: {
        usuarioId: data.userId,
        tokenHash: data.tokenHash,
        expiraEn: data.expiresAt,
      },
    });
  }

  async findByTokenHash(tokenHash: string): Promise<StoredRefreshToken | null> {
    const token = await this.prisma.tokenRenovacion.findUnique({ where: { tokenHash } });
    if (!token) {
      return null;
    }
    return {
      id: token.id,
      tokenHash: token.tokenHash,
      userId: token.usuarioId,
      expiresAt: token.expiraEn,
      revokedAt: token.revocadoEn,
    };
  }

  async revokeIfActive(tokenHash: string): Promise<StoredRefreshToken | null> {
    const existing = await this.prisma.tokenRenovacion.findUnique({ where: { tokenHash } });
    if (!existing) {
      return null;
    }

    const { count } = await this.prisma.tokenRenovacion.updateMany({
      where: { id: existing.id, revocadoEn: null },
      data: { revocadoEn: new Date() },
    });

    if (count === 0) {
      return null;
    }

    return {
      id: existing.id,
      tokenHash: existing.tokenHash,
      userId: existing.usuarioId,
      expiresAt: existing.expiraEn,
      revokedAt: existing.revocadoEn,
    };
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.tokenRenovacion.update({
      where: { id },
      data: { revocadoEn: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.tokenRenovacion.updateMany({
      where: { usuarioId: userId, revocadoEn: null },
      data: { revocadoEn: new Date() },
    });
  }
}
