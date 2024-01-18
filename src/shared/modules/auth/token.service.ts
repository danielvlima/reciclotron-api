import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { Tokens } from 'src/shared/types';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async getTokens(
    key: string,
    email: string,
    userLevel: string,
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: key,
          email,
          userLevel,
        },
        {
          secret: env.AT_TOKEN_SECRET,
          expiresIn: env.AT_EXPIRATION_TOKEN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: key,
          email,
          userLevel,
        },
        {
          secret: env.RT_TOKEN_SECRET,
          expiresIn: env.RT_EXPIRATION_TOKEN,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
