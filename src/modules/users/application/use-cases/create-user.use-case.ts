import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../../presentation/dtos/create-user.dto';
import { IHashingService } from '../../../../shared/domain/services/hashing.service.interface';
import { AuthenticatedUser } from '../../../../shared/domain/types/authenticated-user';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IHashingService)
    private readonly hashingService: IHashingService,
  ) {}

  async execute(dto: CreateUserDto, creator: AuthenticatedUser): Promise<UserEntity> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El correo ya está registrado.');
    }

    const hashedPassword = await this.hashingService.hash(dto.password);

    return this.userRepository.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      role: dto.role,
      organizationId: creator.organizationId,
    });
  }
}
