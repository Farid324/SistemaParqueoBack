import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../../presentation/dtos/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El correo ya está registrado.');
    }

    return this.userRepository.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      role: dto.role,
    });
  }
}
