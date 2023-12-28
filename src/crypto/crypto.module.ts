import { Module } from '@nestjs/common';
import crypto from 'crypto';

@Module({})
export class CryptoModule {
  static sha256 = (text: string, salt: string) => {
    return crypto.createHash('sha256').update(text).update(salt).digest('hex');
  };

  static salt = () => {
    return crypto.randomBytes(8).toString('hex');
  };
}
