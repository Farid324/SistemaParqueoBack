import { Injectable } from '@nestjs/common';

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
}

@Injectable()
export class GetHealthUseCase {
  execute(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
