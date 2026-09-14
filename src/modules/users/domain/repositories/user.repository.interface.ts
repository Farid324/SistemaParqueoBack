import { UserEntity } from '../entities/user.entity';

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role?: UserEntity['role'];
  organizationId?: string | null;
  phone?: string | null;
}

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findAll(organizationId?: string): Promise<UserEntity[]>;
  create(data: CreateUserData): Promise<UserEntity>;
}

export const IUserRepository = Symbol('IUserRepository');
