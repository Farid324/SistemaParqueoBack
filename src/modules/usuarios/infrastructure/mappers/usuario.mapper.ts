import { Usuario as PrismaUsuario } from '@prisma/client';
import { UsuarioEntity } from '../../domain/entities/usuario.entity';

export class UsuarioMapper {
  static toDomain(prismaUsuario: PrismaUsuario): UsuarioEntity {
    return new UsuarioEntity(
      prismaUsuario.id,
      prismaUsuario.email,
      prismaUsuario.nombre,
      prismaUsuario.rol,
      prismaUsuario.password,
      prismaUsuario.organizacionId,
      prismaUsuario.telefono,
      prismaUsuario.activo,
      prismaUsuario.emailVerificadoEn,
      prismaUsuario.creadoEn,
      prismaUsuario.actualizadoEn,
    );
  }
}
