import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'process';
import { JwtPayload } from '../types';
import { RoleLevel } from '../enum';

@Injectable()
export class PartnerStrategy extends PassportStrategy(Strategy, 'partner') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.AT_TOKEN_SECRET,
    });
  }

  validate(payload: JwtPayload) {
    if (payload.level === RoleLevel.EMPRESA) {
      return payload;
    }
    throw new UnauthorizedException();
  }
}
