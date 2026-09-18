import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Rol } from '@prisma/client';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';
import { IHashingService } from '../../../../shared/domain/services/hashing.service.interface';
import { IEmailService } from '../../../../shared/domain/services/email.service.interface';
import { RegisterCustomerDto } from '../../presentation/dtos/register-customer.dto';
import { TokenService } from '../services/token.service';
import { AuthTokens } from '../../domain/value-objects/auth-tokens.value-object';

@Injectable()
export class RegisterCustomerUseCase {
  private readonly logger = new Logger(RegisterCustomerUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(IHashingService)
    private readonly hashingService: IHashingService,
    @Inject(IEmailService)
    private readonly emailService: IEmailService,
    private readonly tokenService: TokenService,
    private readonly config: ConfigService,
  ) {}

  async execute(dto: RegisterCustomerDto): Promise<AuthTokens> {
    const existingUsuario = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existingUsuario) {
      throw new ConflictException('El correo ya está registrado.');
    }

    const hashedPassword = await this.hashingService.hash(dto.password);

    const usuario = await this.prisma.usuario.create({
      data: {
        email: dto.email,
        nombre: dto.name,
        password: hashedPassword,
        telefono: dto.phone,
        rol: Rol.CLIENTE,
      },
    });

    const verificationToken = this.tokenService.generateEmailVerificationToken(usuario.id);
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');

    const emailSent = await this.emailService.sendEmail({
      to: usuario.email,
      subject: '¡Bienvenido a Sistema Parqueo SaaS!',
      template: 'welcome',
      context: {
        name: usuario.nombre,
        appName: 'Sistema Parqueo SaaS',
        year: new Date().getFullYear(),
        verificationUrl: `${frontendUrl}/verificar-email?token=${verificationToken}`,
      },
    });

    if (!emailSent) {
      this.logger.warn(
        `No se pudo enviar el correo de verificación a ${usuario.email}. El usuario quedó creado pero sin email de bienvenida/verificación.`,
      );
    }

    return this.tokenService.issueTokens({
      id: usuario.id,
      email: usuario.email,
      role: usuario.rol,
      organizationId: usuario.organizacionId,
    });
  }
}
