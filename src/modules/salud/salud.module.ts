import { Module } from '@nestjs/common';
import { SaludController } from './presentation/controllers/salud.controller';
import { ObtenerSaludUseCase } from './application/use-cases/obtener-salud.use-case';

@Module({
  controllers: [SaludController],
  providers: [ObtenerSaludUseCase],
  exports: [ObtenerSaludUseCase],
})
export class SaludModule {}
