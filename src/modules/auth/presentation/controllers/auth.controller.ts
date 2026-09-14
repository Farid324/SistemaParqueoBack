import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterOwnerUseCase } from '../../application/use-cases/register-owner.use-case';
import { RegisterCustomerUseCase } from '../../application/use-cases/register-customer.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { VerifyEmailUseCase } from '../../application/use-cases/verify-email.use-case';
import { RegisterOwnerDto } from '../dtos/register-owner.dto';
import { RegisterCustomerDto } from '../dtos/register-customer.dto';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { VerifyEmailDto } from '../dtos/verify-email.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { Public } from '../../../../shared/infrastructure/http/decorators/public.decorator';
import { CurrentUser } from '../../../../shared/infrastructure/http/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../../shared/domain/types/authenticated-user';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerOwnerUseCase: RegisterOwnerUseCase,
    private readonly registerCustomerUseCase: RegisterCustomerUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
  ) {}

  @Public()
  @Post('register/owner')
  @ApiOperation({ summary: 'Registrar un dueño de parqueo y su organización' })
  @ApiResponse({ status: 201, description: 'Organización y usuario creados' })
  @ApiResponse({ status: 409, description: 'El correo ya está registrado' })
  registerOwner(@Body() dto: RegisterOwnerDto): Promise<AuthResponseDto> {
    return this.registerOwnerUseCase.execute(dto);
  }

  @Public()
  @Post('register/customer')
  @ApiOperation({ summary: 'Registrar un usuario final (conductor)' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  @ApiResponse({ status: 409, description: 'El correo ya está registrado' })
  registerCustomer(@Body() dto: RegisterCustomerDto): Promise<AuthResponseDto> {
    return this.registerCustomerUseCase.execute(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Tokens emitidos' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotar el access token usando un refresh token válido' })
  @ApiResponse({ status: 200, description: 'Nuevo par de tokens' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.refreshTokenUseCase.execute(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cerrar sesión en todos los dispositivos (revoca refresh tokens)' })
  @ApiResponse({ status: 204, description: 'Sesión cerrada' })
  async logout(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.logoutUseCase.execute(user.userId);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Verificar el correo electrónico con el token enviado por email' })
  @ApiResponse({ status: 204, description: 'Correo verificado' })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<void> {
    await this.verifyEmailUseCase.execute(dto.token);
  }
}
