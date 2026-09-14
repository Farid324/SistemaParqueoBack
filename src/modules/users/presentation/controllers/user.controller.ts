import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUsersUseCase } from '../../application/use-cases/get-users.use-case';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { Roles } from '../../../../shared/infrastructure/http/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/infrastructure/http/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../../shared/domain/types/authenticated-user';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
  ) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.OWNER)
  @ApiOperation({ summary: 'Crear un usuario (operador o cliente) dentro de la organización' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya existe' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    const user = await this.createUserUseCase.execute(createUserDto, currentUser);
    return UserResponseDto.fromEntity(user);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.OWNER, Role.OPERATOR)
  @ApiOperation({ summary: 'Obtener los usuarios de la organización del solicitante' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios registrados' })
  async findAll(@CurrentUser() currentUser: AuthenticatedUser): Promise<UserResponseDto[]> {
    const users = await this.getUsersUseCase.execute(currentUser);
    return UserResponseDto.fromEntities(users);
  }
}
