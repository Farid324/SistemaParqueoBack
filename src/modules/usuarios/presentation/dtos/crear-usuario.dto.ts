import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Rol } from '../../domain/entities/usuario.entity';

const ROLES_ASIGNABLES = [Rol.OPERADOR, Rol.CLIENTE] as const;

export class CrearUsuarioDto {
  @ApiProperty({ example: 'operador@parqueo.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({ example: 'Pass1234!', description: 'Contraseña del usuario', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    enum: ROLES_ASIGNABLES,
    default: Rol.OPERADOR,
    description: 'Rol asignado al usuario dentro de la organización (OPERADOR o CLIENTE)',
  })
  @IsEnum(ROLES_ASIGNABLES)
  @IsOptional()
  rol?: Rol;
}
