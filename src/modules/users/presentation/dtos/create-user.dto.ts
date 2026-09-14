import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../domain/entities/user.entity';

const ASSIGNABLE_ROLES = [Role.OPERATOR, Role.CUSTOMER] as const;

export class CreateUserDto {
  @ApiProperty({ example: 'operador@parqueo.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Pass1234!', description: 'Contraseña del usuario', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    enum: ASSIGNABLE_ROLES,
    default: Role.OPERATOR,
    description: 'Rol asignado al usuario dentro de la organización (OPERATOR o CUSTOMER)',
  })
  @IsEnum(ASSIGNABLE_ROLES)
  @IsOptional()
  role?: Role;
}
