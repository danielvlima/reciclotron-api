import { Module } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

@Module({})
export class CryptoModule {
  static sha256 = (text: string, salt: string) => {
    return createHash('sha256').update(text).update(salt).digest('hex');
  };

  static salt = () => {
    return randomBytes(8).toString('hex');
  };
}
