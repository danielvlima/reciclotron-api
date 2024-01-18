import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateRtHash(cpf: string, rt: string) {
    const hash = CryptoModule.sha256(rt);
    await this.prisma.usuarios.update({
      where: {
        cpf: cpf,
      },
      data: {
        token: hash,
      },
    });
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

  refreshToken() {
    throw new NotImplementedException();
  }
}
