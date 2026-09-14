import { Module } from '@nestjs/common';
import { UsuarioController } from './presentation/controllers/usuario.controller';
import { CrearUsuarioUseCase } from './application/use-cases/crear-usuario.use-case';
import { ObtenerUsuariosUseCase } from './application/use-cases/obtener-usuarios.use-case';
import { IUsuarioRepository } from './domain/repositories/usuario.repository.interface';
import { PrismaUsuarioRepository } from './infrastructure/repositories/prisma-usuario.repository';

@Module({
  controllers: [UsuarioController],
  providers: [
    CrearUsuarioUseCase,
    ObtenerUsuariosUseCase,
    {
      provide: IUsuarioRepository,
      useClass: PrismaUsuarioRepository,
    },
  ],
  exports: [CrearUsuarioUseCase, ObtenerUsuariosUseCase, IUsuarioRepository],
})
export class UsuariosModule {}
