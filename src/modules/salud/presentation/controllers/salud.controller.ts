import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ObtenerSaludUseCase } from '../../application/use-cases/obtener-salud.use-case';
import { Public } from '../../../../shared/infrastructure/http/decorators/public.decorator';

@ApiTags('Health Check')
@Controller('health')
export class SaludController {
  constructor(private readonly obtenerSaludUseCase: ObtenerSaludUseCase) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Verificar el estado del servicio y la base de datos' })
  @ApiResponse({ status: 200, description: 'Servicio en estado óptimo' })
  @ApiResponse({ status: 503, description: 'La base de datos no responde' })
  getHealth() {
    return this.obtenerSaludUseCase.execute();
  }
}
