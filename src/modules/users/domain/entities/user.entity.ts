import { Role } from '@prisma/client';

export { Role };

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: Role,
    public readonly password: string,
    public readonly organizationId: string | null,
    public readonly phone: string | null,
    public readonly isActive: boolean,
    public readonly emailVerifiedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: {
    id?: string;
    email: string;
    name: string;
    password: string;
    role?: Role;
    organizationId?: string | null;
    phone?: string | null;
    isActive?: boolean;
    emailVerifiedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): UserEntity {
    return new UserEntity(
      props.id ?? '',
      props.email,
      props.name,
      props.role ?? Role.CUSTOMER,
      props.password,
      props.organizationId ?? null,
      props.phone ?? null,
      props.isActive ?? true,
      props.emailVerifiedAt ?? null,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }
}
