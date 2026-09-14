import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'dueno@miparqueo.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Pass1234!' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
