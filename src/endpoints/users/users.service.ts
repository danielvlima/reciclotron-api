import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { Tokens } from 'src/shared/types';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getTokens(
    cpf: string,
    email: string,
    userLevel: string,
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: cpf,
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
          sub: cpf,
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

  create = (createUserDto: CreateUserDto) => {
    return this.prisma.usuarios.create({
      data: createUserDto,
    });
  };

  findOne = (email: string) => {
    return this.prisma.usuarios.findFirstOrThrow({
      where: {
        email,
      },
    });
  };

  findOneWithCpf = (cpf: string) => {
    return this.prisma.usuarios.findFirstOrThrow({
      where: {
        cpf,
      },
    });
  };

  update = (updateUserDto: UpdateUserDto) => {
    return this.prisma.usuarios.update({
      where: {
        cpf: updateUserDto.cpf,
      },

      data: {
        ...updateUserDto,
        atualizadoEm: new Date(),
        codigoRecuperacao: null,
        codigoRecuperacaoCriadoEm: null,
      },
    });
  };

  updateRecoveryCode = (cpf: string, code: string) => {
    const now = new Date();
    return this.prisma.usuarios.update({
      where: {
        cpf,
      },

      data: {
        codigoRecuperacao: code,
        atualizadoEm: now,
        codigoRecuperacaoCriadoEm: now,
      },
    });
  };

  remove = (cpf: string) => {
    return this.prisma.usuarios.delete({
      where: {
        cpf,
      },
    });
  };

  logout() {
    throw new NotImplementedException();
  }

  refreshToken() {
    throw new NotImplementedException();
  }
}
