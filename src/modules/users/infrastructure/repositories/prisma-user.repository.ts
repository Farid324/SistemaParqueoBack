import { Injectable } from '@nestjs/common';
import {
  CreateUserData,
  IUserRepository,
} from '../../domain/repositories/user.repository.interface';
import { UserEntity, Role } from '../../domain/entities/user.entity';
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

  async findAll(organizationId?: string): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: organizationId ? { organizationId } : undefined,
    });
    return users.map(UserMapper.toDomain);
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const created = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        role: data.role
          ? UserMapper.toPrismaRole(data.role)
          : UserMapper.toPrismaRole(Role.CUSTOMER),
        organizationId: data.organizationId ?? undefined,
        phone: data.phone ?? undefined,
      },
    });
    return UserMapper.toDomain(created);
  }
}
