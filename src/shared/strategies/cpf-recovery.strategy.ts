import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'process';
import { JwtKeyPayload } from '../types';
import { CompareModule } from '../modules/compare/compare.module';
import { AccessDaniedException } from 'src/exceptions';

@Injectable()
export class CpfRecoveryStrategy extends PassportStrategy(
  Strategy,
  'cpf-recovery',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.RP_EXPIRATION_TOKEN,
    });
  }

  validate(payload: JwtKeyPayload) {
    if (CompareModule.isCPF(payload.sub)) {
      return payload;
    }
    throw new AccessDaniedException();
  }
}
