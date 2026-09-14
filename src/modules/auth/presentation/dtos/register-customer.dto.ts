import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterCustomerDto {
  @ApiProperty({ example: 'María Gómez' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'maria@correo.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Pass1234!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: '+593987654321', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}
