import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';
import { IHashingService } from '../../../../shared/domain/services/hashing.service.interface';
import { IEmailService } from '../../../../shared/domain/services/email.service.interface';
import { RegisterOwnerDto } from '../../presentation/dtos/register-owner.dto';
import { TokenService } from '../services/token.service';
import { AuthTokens } from '../../domain/value-objects/auth-tokens.value-object';
import { Rol, EstadoSuscripcion, Prisma } from '@prisma/client';

const UNIQUE_CONSTRAINT_ERROR_CODE = 'P2002';

const TRIAL_DAYS = 14;
const DEFAULT_MAX_PARKING_LOTS = 1;
const DEFAULT_MAX_SPOTS_PER_LOT = 20;

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'organizacion'
  );
}

@Injectable()
export class RegisterOwnerUseCase {
  private readonly logger = new Logger(RegisterOwnerUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(IHashingService)
    private readonly hashingService: IHashingService,
    @Inject(IEmailService)
    private readonly emailService: IEmailService,
    private readonly tokenService: TokenService,
    private readonly config: ConfigService,
  ) {}

  async execute(dto: RegisterOwnerDto): Promise<AuthTokens> {
    const existingUsuario = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existingUsuario) {
      throw new ConflictException('El correo ya está registrado.');
    }

    const baseSlug = slugify(dto.organizationName);
    let slug = baseSlug;
    let attempt = 1;
    while (await this.prisma.organizacion.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${attempt}`;
      attempt += 1;
    }

    const hashedPassword = await this.hashingService.hash(dto.password);

    const planPrueba = await this.prisma.plan.upsert({
      where: { nombre: 'Free Trial' },
      update: {},
      create: {
        nombre: 'Free Trial',
        descripcion: 'Plan de prueba gratuito por 14 días',
        precioCentavos: 0,
        maxParqueaderos: DEFAULT_MAX_PARKING_LOTS,
        maxEspaciosPorParqueadero: DEFAULT_MAX_SPOTS_PER_LOT,
      },
    });

    const { usuario, organizacionId } = await this.prisma.$transaction(async (tx) => {
      let organizacion;
      try {
        organizacion = await tx.organizacion.create({
          data: { nombre: dto.organizationName, slug },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === UNIQUE_CONSTRAINT_ERROR_CODE
        ) {
          throw new ConflictException(
            'Ese nombre de organización ya está en uso, intenta de nuevo.',
          );
        }
        throw error;
      }

      await tx.suscripcion.create({
        data: {
          organizacionId: organizacion.id,
          planId: planPrueba.id,
          estado: EstadoSuscripcion.PRUEBA,
          finPeriodoActual: new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000),
        },
      });

      const usuarioCreado = await tx.usuario.create({
        data: {
          email: dto.email,
          nombre: dto.name,
          password: hashedPassword,
          rol: Rol.PROPIETARIO,
          organizacionId: organizacion.id,
        },
      });

      return { usuario: usuarioCreado, organizacionId: organizacion.id };
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
      organizationId: organizacionId,
    });
  }
}
