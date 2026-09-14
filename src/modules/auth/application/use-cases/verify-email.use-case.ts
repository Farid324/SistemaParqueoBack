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

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('El usuario no existe.');
    }

    if (!user.emailVerifiedAt) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { emailVerifiedAt: new Date() },
      });
    }
  }
}
