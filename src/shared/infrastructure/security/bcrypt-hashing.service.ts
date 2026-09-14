import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IHashingService } from '../../domain/services/hashing.service.interface';

const SALT_ROUNDS = 10;

@Injectable()
export class BcryptHashingService implements IHashingService {
  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  }

  compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
