import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { AuthenticatedUser } from '../../../../shared/domain/types/authenticated-user';
import { Role } from '../../domain/entities/user.entity';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(requester: AuthenticatedUser): Promise<UserEntity[]> {
    if (requester.role === Role.SUPER_ADMIN) {
      return this.userRepository.findAll();
    }

    return this.userRepository.findAll(requester.organizationId ?? undefined);
  }
}
