import { Rol } from '@prisma/client';

export { Rol };

export class UsuarioEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly nombre: string,
    public readonly rol: Rol,
    public readonly password: string,
    public readonly organizacionId: string | null,
    public readonly telefono: string | null,
    public readonly activo: boolean,
    public readonly emailVerificadoEn: Date | null,
    public readonly creadoEn: Date,
    public readonly actualizadoEn: Date,
  ) {}

  static create(props: {
    id?: string;
    email: string;
    nombre: string;
    password: string;
    rol?: Rol;
    organizacionId?: string | null;
    telefono?: string | null;
    activo?: boolean;
    emailVerificadoEn?: Date | null;
    creadoEn?: Date;
    actualizadoEn?: Date;
  }): UsuarioEntity {
    return new UsuarioEntity(
      props.id ?? '',
      props.email,
      props.nombre,
      props.rol ?? Rol.CLIENTE,
      props.password,
      props.organizacionId ?? null,
      props.telefono ?? null,
      props.activo ?? true,
      props.emailVerificadoEn ?? null,
      props.creadoEn ?? new Date(),
      props.actualizadoEn ?? new Date(),
    );
  }
}
