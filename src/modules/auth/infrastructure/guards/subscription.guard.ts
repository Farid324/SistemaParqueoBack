import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthenticatedUser } from '../../../../shared/domain/types/authenticated-user';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';

const ACTIVE_STATUSES = ['TRIALING', 'ACTIVE'];

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    const user = request.user;

    if (!user || user.role === Role.SUPER_ADMIN || user.role === Role.CUSTOMER) {
      return true;
    }

    if (!user.organizationId) {
      throw new ForbiddenException('El usuario no pertenece a ninguna organización.');
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId: user.organizationId },
    });

    if (!subscription || !ACTIVE_STATUSES.includes(subscription.status)) {
      throw new ForbiddenException(
        'La suscripción de tu organización no está activa. Contacta a soporte.',
      );
    }

    return true;
  }
}
