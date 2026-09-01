export enum Role {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  CUSTOMER = 'CUSTOMER',
}

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: Role,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly password?: string,
  ) {}

  static create(props: {
    id?: string;
    email: string;
    name: string;
    role?: Role;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): UserEntity {
    return new UserEntity(
      props.id ?? '',
      props.email,
      props.name,
      props.role ?? Role.OPERATOR,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
      props.password,
    );
  }
}
