import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'process';
import { JwtPayload } from '../types';
import { CompareModule } from '../modules/compare/compare.module';
import { AccessDaniedException } from 'src/exceptions';

@Injectable()
export class CpfStrategy extends PassportStrategy(Strategy, 'cpf') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.AT_TOKEN_SECRET,
    });
  }

  validate(payload: JwtPayload) {
    if (CompareModule.isCPF(payload.sub)) {
      return payload;
    }
    throw new AccessDaniedException();
  }
}
