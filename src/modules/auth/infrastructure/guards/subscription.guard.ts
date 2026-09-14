import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Rol, EstadoSuscripcion } from '@prisma/client';
import { AuthenticatedUser } from '../../../../shared/domain/types/authenticated-user';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';

const ESTADOS_ACTIVOS: EstadoSuscripcion[] = [EstadoSuscripcion.PRUEBA, EstadoSuscripcion.ACTIVA];

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    const user = request.user;

    if (!user || user.role === Rol.SUPER_ADMIN || user.role === Rol.CLIENTE) {
      return true;
    }

    if (!user.organizationId) {
      throw new ForbiddenException('El usuario no pertenece a ninguna organización.');
    }

    const suscripcion = await this.prisma.suscripcion.findUnique({
      where: { organizacionId: user.organizationId },
    });

    const vencida = suscripcion ? suscripcion.finPeriodoActual.getTime() < Date.now() : true;

    if (!suscripcion || vencida || !ESTADOS_ACTIVOS.includes(suscripcion.estado)) {
      throw new ForbiddenException(
        'La suscripción de tu organización no está activa. Contacta a soporte.',
      );
    }

    return true;
  }
}
