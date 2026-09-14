import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterOwnerDto {
  @ApiProperty({ example: 'Parqueos El Sol S.A.', description: 'Nombre de la organización' })
  @IsString()
  @IsNotEmpty()
  organizationName!: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del dueño' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'dueno@miparqueo.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Pass1234!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}
