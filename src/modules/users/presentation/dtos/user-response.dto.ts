import { ApiProperty } from '@nestjs/swagger';
import { UserEntity, Role } from '../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ nullable: true })
  organizationId: string | null;

  @ApiProperty({ nullable: true })
  phone: string | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  private constructor(entity: UserEntity) {
    this.id = entity.id;
    this.email = entity.email;
    this.name = entity.name;
    this.role = entity.role;
    this.organizationId = entity.organizationId;
    this.phone = entity.phone;
    this.isActive = entity.isActive;
    this.createdAt = entity.createdAt;
  }

  static fromEntity(entity: UserEntity): UserResponseDto {
    return new UserResponseDto(entity);
  }

  static fromEntities(entities: UserEntity[]): UserResponseDto[] {
    return entities.map((entity) => UserResponseDto.fromEntity(entity));
  }
}
