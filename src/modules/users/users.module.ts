import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUsersUseCase } from './application/use-cases/get-users.use-case';
import { IUserRepository } from './domain/repositories/user.repository.interface';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetUsersUseCase,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [CreateUserUseCase, GetUsersUseCase, IUserRepository],
})
export class UsersModule {}
