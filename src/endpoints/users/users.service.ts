import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';
import { TokenService } from 'src/shared/modules/auth/token.service';
import { NotFoundUserException } from 'src/exceptions';
import { PrismaErrorCode } from 'src/shared/enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async updateRtHash(cpf: string, rt: string) {
    const hash = CryptoModule.sha256(rt);
    await this.prisma.usuarios.update({
      where: {
        cpf: cpf,
      },
      data: {
        token: hash,
        atualizadoEm: new Date(),
      },
    });
  }

  create = (createUserDto: CreateUserDto) => {
    return this.prisma.usuarios.create({
      data: createUserDto,
    });
  };

  findOne = (email: string) => {
    return this.prisma.usuarios
      .findFirstOrThrow({
        where: {
          email,
        },
      })
      .catch((err: Prisma.PrismaClientKnownRequestError) => {
        if (err.code === PrismaErrorCode.NotFoundError) {
          throw new NotFoundUserException();
        }
        throw err;
      });
  };

  findOneWithCpf = (cpf: string) => {
    return this.prisma.usuarios
      .findFirstOrThrow({
        where: {
          cpf,
        },
      })
      .catch((err: Prisma.PrismaClientKnownRequestError) => {
        if (err.code === PrismaErrorCode.NotFoundError) {
          throw new NotFoundUserException();
        }
        throw err;
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
    return this.prisma.usuarios
      .delete({
        where: {
          cpf,
        },
      })
      .catch((err: Prisma.PrismaClientKnownRequestError) => {
        if (err.code === PrismaErrorCode.NotFoundError) {
          throw new NotFoundUserException();
        }
        throw err;
      });
  };

  logout(cpf: string) {
    return this.prisma.usuarios.updateMany({
      where: {
        cpf: cpf,
        token: {
          not: null,
        },
      },
      data: {
        token: null,
      },
    });
  }

  async refreshToken(cpf: string, rt: string) {
    const user = await this.findOneWithCpf(cpf);
    CryptoModule.checkRtToken(user.token, rt);
    const tokens = await this.tokenService.getTokens(
      cpf,
      user.email,
      user.nivelPrivilegio.toString(),
    );

    await this.updateRtHash(cpf, tokens.refresh_token);
    return tokens;
  }
}
