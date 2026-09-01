import { User as PrismaUser, Role as PrismaRole } from '@prisma/client';
import { UserEntity, Role } from '../../domain/entities/user.entity';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): UserEntity {
    return new UserEntity(
      prismaUser.id,
      prismaUser.email,
      prismaUser.name,
      prismaUser.role as Role,
      prismaUser.createdAt,
      prismaUser.updatedAt,
      prismaUser.password,
    );
  }

  static toPrismaRole(role: Role): PrismaRole {
    return role as unknown as PrismaRole;
  }
}
