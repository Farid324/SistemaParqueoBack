import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';
import { RefreshTokenDto } from '../../presentation/dtos/refresh-token.dto';
import { TokenService } from '../services/token.service';
import { AuthTokens } from '../../domain/value-objects/auth-tokens.value-object';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthTokens> {
    return this.tokenService.rotateRefreshToken(dto.refreshToken, async (userId) => {
      const usuario = await this.prisma.usuario.findUnique({ where: { id: userId } });
      if (!usuario) {
        return null;
      }
      return {
        id: usuario.id,
        email: usuario.email,
        role: usuario.rol,
        organizationId: usuario.organizacionId,
      };
    });
  }
}
