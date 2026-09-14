import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { IUsuarioRepository } from '../../domain/repositories/usuario.repository.interface';
import { UsuarioEntity } from '../../domain/entities/usuario.entity';
import { CrearUsuarioDto } from '../../presentation/dtos/crear-usuario.dto';
import { IHashingService } from '../../../../shared/domain/services/hashing.service.interface';
import { AuthenticatedUser } from '../../../../shared/domain/types/authenticated-user';

@Injectable()
export class CrearUsuarioUseCase {
  constructor(
    @Inject(IUsuarioRepository)
    private readonly usuarioRepository: IUsuarioRepository,
    @Inject(IHashingService)
    private readonly hashingService: IHashingService,
  ) {}

  async execute(dto: CrearUsuarioDto, creator: AuthenticatedUser): Promise<UsuarioEntity> {
    if (!creator.organizationId) {
      throw new BadRequestException(
        'No se puede crear un usuario sin una organización asociada al solicitante.',
      );
    }

    const existing = await this.usuarioRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El correo ya está registrado.');
    }

    const hashedPassword = await this.hashingService.hash(dto.password);

    return this.usuarioRepository.create({
      email: dto.email,
      nombre: dto.nombre,
      password: hashedPassword,
      rol: dto.rol,
      organizacionId: creator.organizationId,
    });
  }
}
