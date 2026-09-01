import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../domain/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'admin@parqueo.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'Pass1234!', description: 'Contraseña del usuario', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ enum: Role, default: Role.OPERATOR, description: 'Rol asignado al usuario' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
