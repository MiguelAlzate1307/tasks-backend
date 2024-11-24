import { Injectable } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { compare, hash } from 'bcrypt';

@Injectable()
export class HashingService implements BcryptService {
  async hash(data: string | Buffer): Promise<string> {
    return await hash(data, 10);
  }

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return await compare(data, encrypted);
  }
}
