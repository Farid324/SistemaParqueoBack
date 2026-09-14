import { Test, TestingModule } from '@nestjs/testing';
import { SaludController } from './salud.controller';
import { ObtenerSaludUseCase } from '../../application/use-cases/obtener-salud.use-case';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';

describe('SaludController', () => {
  let controller: SaludController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaludController],
      providers: [
        ObtenerSaludUseCase,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
          },
        },
      ],
    }).compile();

    controller = module.get<SaludController>(SaludController);
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
