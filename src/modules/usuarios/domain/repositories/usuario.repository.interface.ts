import { UsuarioEntity } from '../entities/usuario.entity';

export interface CrearUsuarioData {
  email: string;
  nombre: string;
  password: string;
  rol?: UsuarioEntity['rol'];
  organizacionId?: string | null;
  telefono?: string | null;
}

export interface IUsuarioRepository {
  findById(id: string): Promise<UsuarioEntity | null>;
  findByEmail(email: string): Promise<UsuarioEntity | null>;
  findAll(organizacionId?: string): Promise<UsuarioEntity[]>;
  create(data: CrearUsuarioData): Promise<UsuarioEntity>;
}

export const IUsuarioRepository = Symbol('IUsuarioRepository');
