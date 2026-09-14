import { Injectable } from '@nestjs/common';
import {
  CrearUsuarioData,
  IUsuarioRepository,
} from '../../domain/repositories/usuario.repository.interface';
import { UsuarioEntity, Rol } from '../../domain/entities/usuario.entity';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';
import { UsuarioMapper } from '../mappers/usuario.mapper';

@Injectable()
export class PrismaUsuarioRepository implements IUsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UsuarioEntity | null> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    return usuario ? UsuarioMapper.toDomain(usuario) : null;
  }

  async findByEmail(email: string): Promise<UsuarioEntity | null> {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    return usuario ? UsuarioMapper.toDomain(usuario) : null;
  }

  async findAll(organizacionId?: string): Promise<UsuarioEntity[]> {
    const usuarios = await this.prisma.usuario.findMany({
      where: organizacionId ? { organizacionId } : undefined,
    });
    return usuarios.map(UsuarioMapper.toDomain);
  }

  async create(data: CrearUsuarioData): Promise<UsuarioEntity> {
    const creado = await this.prisma.usuario.create({
      data: {
        email: data.email,
        nombre: data.nombre,
        password: data.password,
        rol: data.rol ?? Rol.OPERADOR,
        organizacionId: data.organizacionId ?? undefined,
        telefono: data.telefono ?? undefined,
      },
    });
    return UsuarioMapper.toDomain(creado);
  }
}
