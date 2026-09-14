import { ApiProperty } from '@nestjs/swagger';
import { UsuarioEntity, Rol } from '../../domain/entities/usuario.entity';

export class UsuarioResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty({ enum: Rol })
  rol: Rol;

  @ApiProperty({ nullable: true })
  organizacionId: string | null;

  @ApiProperty({ nullable: true })
  telefono: string | null;

  @ApiProperty()
  activo: boolean;

  @ApiProperty()
  creadoEn: Date;

  private constructor(entity: UsuarioEntity) {
    this.id = entity.id;
    this.email = entity.email;
    this.nombre = entity.nombre;
    this.rol = entity.rol;
    this.organizacionId = entity.organizacionId;
    this.telefono = entity.telefono;
    this.activo = entity.activo;
    this.creadoEn = entity.creadoEn;
  }

  static fromEntity(entity: UsuarioEntity): UsuarioResponseDto {
    return new UsuarioResponseDto(entity);
  }

  static fromEntities(entities: UsuarioEntity[]): UsuarioResponseDto[] {
    return entities.map((entity) => UsuarioResponseDto.fromEntity(entity));
  }
}
