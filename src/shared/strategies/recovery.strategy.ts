import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'process';
import { JwtRecoveryPayload } from '../types';

@Injectable()
export class RecoveryStrategy extends PassportStrategy(Strategy, 'recovery') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.RP_EXPIRATION_TOKEN,
    });
  }

  validate(payload: JwtRecoveryPayload) {
    return payload;
  }
}
