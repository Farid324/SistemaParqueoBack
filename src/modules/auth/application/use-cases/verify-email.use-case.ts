import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(token: string): Promise<void> {
    const userId = this.tokenService.verifyEmailVerificationToken(token);

    const usuario = await this.prisma.usuario.findUnique({ where: { id: userId } });
    if (!usuario) {
      throw new NotFoundException('El usuario no existe.');
    }

    if (!usuario.emailVerificadoEn) {
      await this.prisma.usuario.update({
        where: { id: userId },
        data: { emailVerificadoEn: new Date() },
      });
    }
  }
}
