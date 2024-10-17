import { ForbiddenException, Logger, Module } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

@Module({})
export class CryptoModule {
  static sha256 = (text: string, salt?: string) => {
    if (salt) {
      return createHash('sha256').update(text).update(salt).digest('hex');
    }
    return createHash('sha256').update(text).digest('hex');
  };

  static salt = () => {
    return randomBytes(8).toString('hex');
  };

  static hashPassword = (password: string) => {
    const s = CryptoModule.salt();
    return `${CryptoModule.sha256(password, s)}:${s}`;
  };

  static checkPasssword = (entityPassword: string, password: string) => {
    const passwordSplitted = entityPassword.split(':');
    const passwordHashed = CryptoModule.sha256(password, passwordSplitted[1]);

    if (passwordSplitted[0] !== passwordHashed) {
      throw new ForbiddenException('Senha Incorreta');
    }
  };

  static checkRtToken = (entityToken: string, token: string) => {
    const tokenHashed = CryptoModule.sha256(token);
    if (entityToken !== tokenHashed) {
      Logger.debug('entrou');
      Logger.debug(tokenHashed);
      Logger.debug(entityToken);
      Logger.debug(token);
      throw new ForbiddenException('Acesso Negado');
    }
  };
}
