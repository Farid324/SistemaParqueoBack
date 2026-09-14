import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { GetHealthUseCase } from '../../application/use-cases/get-health.use-case';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        GetHealthUseCase,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health status when the database is up', async () => {
    const result = await controller.getHealth();
    expect(result.status).toBe('ok');
    expect(result.database).toBe('up');
    expect(result.timestamp).toBeDefined();
    expect(result.uptime).toBeGreaterThanOrEqual(0);
  });
});
