export interface IHashingService {
  hash(plain: string): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
}

export const IHashingService = Symbol('IHashingService');
