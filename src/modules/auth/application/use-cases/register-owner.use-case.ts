import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';
import { IHashingService } from '../../../../shared/domain/services/hashing.service.interface';
import { IEmailService } from '../../../../shared/domain/services/email.service.interface';
import { RegisterOwnerDto } from '../../presentation/dtos/register-owner.dto';
import { TokenService } from '../services/token.service';
import { AuthTokens } from '../../domain/value-objects/auth-tokens.value-object';
import { Role } from '@prisma/client';

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
  constructor(
    private readonly prisma: PrismaService,
    @Inject(IHashingService)
    private readonly hashingService: IHashingService,
    @Inject(IEmailService)
    private readonly emailService: IEmailService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RegisterOwnerDto): Promise<AuthTokens> {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado.');
    }

    const baseSlug = slugify(dto.organizationName);
    let slug = baseSlug;
    let attempt = 1;
    while (await this.prisma.organization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${attempt}`;
      attempt += 1;
    }

    const hashedPassword = await this.hashingService.hash(dto.password);

    const trialPlan = await this.prisma.plan.upsert({
      where: { name: 'Free Trial' },
      update: {},
      create: {
        name: 'Free Trial',
        description: 'Plan de prueba gratuito por 14 días',
        priceCents: 0,
        maxParkingLots: DEFAULT_MAX_PARKING_LOTS,
        maxSpotsPerLot: DEFAULT_MAX_SPOTS_PER_LOT,
      },
    });

    const { user, organizationId } = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: { name: dto.organizationName, slug },
      });

      await tx.subscription.create({
        data: {
          organizationId: organization.id,
          planId: trialPlan.id,
          status: 'TRIALING',
          currentPeriodEnd: new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000),
        },
      });

      const createdUser = await tx.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hashedPassword,
          role: Role.OWNER,
          organizationId: organization.id,
        },
      });

      return { user: createdUser, organizationId: organization.id };
    });

    await this.emailService.sendEmail({
      to: user.email,
      subject: '¡Bienvenido a Sistema Parqueo SaaS!',
      template: 'welcome',
      context: { name: user.name, appName: 'Sistema Parqueo SaaS', year: new Date().getFullYear() },
    });

    return this.tokenService.issueTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId,
    });
  }
}
