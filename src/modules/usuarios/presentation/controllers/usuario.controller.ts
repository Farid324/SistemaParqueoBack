import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Rol } from '@prisma/client';
import { CrearUsuarioUseCase } from '../../application/use-cases/crear-usuario.use-case';
import { ObtenerUsuariosUseCase } from '../../application/use-cases/obtener-usuarios.use-case';
import { CrearUsuarioDto } from '../dtos/crear-usuario.dto';
import { UsuarioResponseDto } from '../dtos/usuario-response.dto';
import { Roles } from '../../../../shared/infrastructure/http/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/infrastructure/http/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../../shared/domain/types/authenticated-user';
import { SubscriptionGuard } from '../../../auth/infrastructure/guards/subscription.guard';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(SubscriptionGuard)
@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly crearUsuarioUseCase: CrearUsuarioUseCase,
    private readonly obtenerUsuariosUseCase: ObtenerUsuariosUseCase,
  ) {}

  @Post()
  @Roles(Rol.PROPIETARIO)
  @ApiOperation({ summary: 'Crear un usuario (operador o cliente) dentro de la organización' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya existe' })
  async create(
    @Body() crearUsuarioDto: CrearUsuarioDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<UsuarioResponseDto> {
    const usuario = await this.crearUsuarioUseCase.execute(crearUsuarioDto, currentUser);
    return UsuarioResponseDto.fromEntity(usuario);
  }

  @Get()
  @Roles(Rol.SUPER_ADMIN, Rol.PROPIETARIO, Rol.OPERADOR)
  @ApiOperation({ summary: 'Obtener los usuarios de la organización del solicitante' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios registrados' })
  async findAll(@CurrentUser() currentUser: AuthenticatedUser): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.obtenerUsuariosUseCase.execute(currentUser);
    return UsuarioResponseDto.fromEntities(usuarios);
  }
}
