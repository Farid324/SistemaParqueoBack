import { Inject, Injectable } from '@nestjs/common';
import { IUsuarioRepository } from '../../domain/repositories/usuario.repository.interface';
import { UsuarioEntity, Rol } from '../../domain/entities/usuario.entity';
import { AuthenticatedUser } from '../../../../shared/domain/types/authenticated-user';

@Injectable()
export class ObtenerUsuariosUseCase {
  constructor(
    @Inject(IUsuarioRepository)
    private readonly usuarioRepository: IUsuarioRepository,
  ) {}

  async execute(requester: AuthenticatedUser): Promise<UsuarioEntity[]> {
    if (requester.role === Rol.SUPER_ADMIN) {
      return this.usuarioRepository.findAll();
    }

    return this.usuarioRepository.findAll(requester.organizationId ?? undefined);
  }
}
