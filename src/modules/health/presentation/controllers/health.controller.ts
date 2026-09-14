import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetHealthUseCase } from '../../application/use-cases/get-health.use-case';
import { Public } from '../../../../shared/infrastructure/http/decorators/public.decorator';

@ApiTags('Health Check')
@Controller('health')
export class HealthController {
  constructor(private readonly getHealthUseCase: GetHealthUseCase) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Verificar el estado del servicio y la base de datos' })
  @ApiResponse({ status: 200, description: 'Servicio en estado óptimo' })
  @ApiResponse({ status: 503, description: 'La base de datos no responde' })
  getHealth() {
    return this.getHealthUseCase.execute();
  }
}
