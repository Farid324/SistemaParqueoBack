import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { PrismaService } from '../../../../shared/infrastructure/persistence/prisma/prisma.service';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map(UserMapper.toDomain);
  }

  async create(userData: Partial<UserEntity>): Promise<UserEntity> {
    const created = await this.prisma.user.create({
      data: {
        email: userData.email!,
        name: userData.name!,
        password: userData.password || 'default_hashed_password',
        role: userData.role ? UserMapper.toPrismaRole(userData.role) : 'OPERATOR',
      },
    });
    return UserMapper.toDomain(created);
  }
}
