import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { JwtPayload, Tokens } from 'src/shared/types';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async getTokens(key: string, email: string, level: string): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: key,
      email,
      level,
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: env.AT_TOKEN_SECRET,
        expiresIn: env.AT_EXPIRATION_TOKEN,
        notBefore: 0,
      }),
      this.jwtService.signAsync(payload, {
        secret: env.RT_TOKEN_SECRET,
        expiresIn: env.RT_EXPIRATION_TOKEN,
        notBefore: 0,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
