import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'process';
import { JwtPayload } from '../types';
import { RoleLevel } from '../enum';
import { AccessDaniedException } from 'src/exceptions';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.AT_TOKEN_SECRET,
    });
  }

  validate(payload: JwtPayload) {
    if (payload.level === RoleLevel.USUARIO) {
      return payload;
    }
    throw new AccessDaniedException();
  }
}
