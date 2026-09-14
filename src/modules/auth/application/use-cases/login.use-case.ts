import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';
import { IHashingService } from '../../../../shared/domain/services/hashing.service.interface';
import { LoginDto } from '../../presentation/dtos/login.dto';
import { TokenService } from '../services/token.service';
import { AuthTokens } from '../../domain/value-objects/auth-tokens.value-object';

const INVALID_CREDENTIALS_MESSAGE = 'Credenciales inválidas.';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(IHashingService)
    private readonly hashingService: IHashingService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordMatches = await this.hashingService.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    return this.tokenService.issueTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    });
  }
}
