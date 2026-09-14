import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Rol } from '@prisma/client';
import { AuthenticatedUser } from '../../../../shared/domain/types/authenticated-user';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Rol;
  organizationId: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id: payload.sub } });

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Usuario inválido o inactivo.');
    }

    return {
      userId: usuario.id,
      email: usuario.email,
      role: usuario.rol,
      organizationId: usuario.organizacionId,
    };
  }
}
