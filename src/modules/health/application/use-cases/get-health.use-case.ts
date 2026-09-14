import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  database: 'up' | 'down';
}

@Injectable()
export class GetHealthUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<HealthStatus> {
    const databaseUp = await this.checkDatabase();

    const status: HealthStatus = {
      status: databaseUp ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: databaseUp ? 'up' : 'down',
    };

    if (!databaseUp) {
      throw new ServiceUnavailableException(status);
    }

    return status;
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
