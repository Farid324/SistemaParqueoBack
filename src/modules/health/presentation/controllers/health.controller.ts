import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetHealthUseCase } from '../../application/use-cases/get-health.use-case';

@ApiTags('Health Check')
@Controller('health')
export class HealthController {
  constructor(private readonly getHealthUseCase: GetHealthUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Verificar el estado del servicio' })
  @ApiResponse({ status: 200, description: 'Servicio en estado óptimo' })
  getHealth() {
    return this.getHealthUseCase.execute();
  }
}
