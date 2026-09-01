import { Module } from '@nestjs/common';
import { HealthController } from './presentation/controllers/health.controller';
import { GetHealthUseCase } from './application/use-cases/get-health.use-case';

@Module({
  controllers: [HealthController],
  providers: [GetHealthUseCase],
  exports: [GetHealthUseCase],
})
export class HealthModule {}
