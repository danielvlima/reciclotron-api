import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  CreatePartnerDto,
  UpdatePartnerDto,
  UpdateAddressPartnerDto,
  GetPaginatedPartnerDto,
  FilterOptionsPartnerDto,
} from './dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { Tokens } from 'src/shared/types';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';

@Injectable()
export class PartnerService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getTokens(cnpj: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: cnpj,
          email,
        },
        {
          secret: env.AT_TOKEN_SECRET,
          expiresIn: env.AT_EXPIRATION_TOKEN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: cnpj,
          email,
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

  async updateRtHash(cnpj: string, rt: string) {
    const hash = CryptoModule.sha256(rt);
    await this.prisma.empresasParceiras.update({
      where: {
        cnpj: cnpj,
      },
      data: {
        token: hash,
      },
    });
  }

  create(data: CreatePartnerDto) {
    return this.prisma.empresasParceiras.create({
      data: {
        cnpj: data.cnpj,
        email: data.email,
        senha: data.senha,
        telefone: data.telefone,
        nomeFantasia: data.nomeFantasia,
        razaoSocial: data.razaoSocial,
        ramo: data.ramo,
        ativo: data.ativo,
        tipoEmpresa: data.tipoEmpresa,
        enderecolojaOnline: data.enderecolojaOnline,
        endereco: {
          create: data.endereco,
        },
      },
      include: {
        endereco: true,
      },
    });
  }

  count(data: FilterOptionsPartnerDto) {
    const filter = [];
    if (data.tipoEmpresa) {
      filter.push({
        tipoEmpresa: {
          equals: data.tipoEmpresa,
        },
      });
    }

    if (data.ativo) {
      filter.push({
        ativo: {
          equals: data.ativo,
        },
      });
    }
    return this.prisma.empresasParceiras.count({
      where: {
        OR: [
          {
            nomeFantasia: {
              contains: data.nome ?? '',
            },
          },
          {
            ramo: {
              contains: data.ramo ?? '',
            },
          },
          ...filter,
        ],
      },
    });
  }

  findPaginated(data: GetPaginatedPartnerDto) {
    const filter = [];
    if (data.filtro.tipoEmpresa) {
      filter.push({
        tipoEmpresa: {
          equals: data.filtro.tipoEmpresa,
        },
      });
    }

    if (data.filtro.ativo) {
      filter.push({
        ativo: {
          equals: data.filtro.ativo,
        },
      });
    }

    return this.prisma.empresasParceiras.findMany({
      where: {
        OR: [
          {
            nomeFantasia: {
              contains: data.filtro.nome ?? '',
            },
          },
          {
            ramo: {
              contains: data.filtro.ramo ?? '',
            },
          },
          ...filter,
        ],
      },
      include: {
        endereco: true,
      },
      take: data.take,
      skip: data.skip,
    });
  }

  findOne(email: string) {
    return this.prisma.empresasParceiras.findFirstOrThrow({
      where: {
        email,
      },
      include: {
        endereco: true,
      },
    });
  }

  findOneWithCnpj(cnpj: string) {
    return this.prisma.empresasParceiras.findFirstOrThrow({
      where: {
        cnpj,
      },
      include: {
        endereco: true,
      },
    });
  }

  update(data: UpdatePartnerDto) {
    return this.prisma.empresasParceiras.update({
      where: {
        cnpj: data.cnpj,
      },

      data: {
        logo: data.logo || undefined,
        email: data.email || undefined,
        senha: data.senha || undefined,
        telefone: data.telefone || undefined,
        nomeFantasia: data.nomeFantasia || undefined,
        razaoSocial: data.razaoSocial || undefined,
        ramo: data.ramo || undefined,
        ativo: data.ativo || undefined,
        tipoEmpresa: data.tipoEmpresa || undefined,
        enderecolojaOnline: data.enderecolojaOnline || undefined,
        atualizadoEm: new Date(),
        codigoRecuperacao: null,
        codigoRecuperacaoCriadoEm: null,
      },
      include: {
        endereco: true,
      },
    });
  }

  updateAddress(cnpj: string, updateAddress: UpdateAddressPartnerDto) {
    return this.prisma.empresasParceiras.update({
      where: {
        cnpj,
      },

      data: {
        atualizadoEm: new Date(),
        endereco: {
          update: {
            rua: updateAddress.rua,
            numero: updateAddress.numero,
            complemento: updateAddress.complemento,
            bairro: updateAddress.bairro,
            cidade: updateAddress.cidade,
            uf: updateAddress.uf,
            cep: updateAddress.cep,
          },
        },
      },
      include: {
        endereco: true,
      },
    });
  }

  updateRecoveryCode = (cnpj: string, code: string) => {
    const now = new Date();
    return this.prisma.empresasParceiras.update({
      where: {
        cnpj,
      },

      data: {
        codigoRecuperacao: code,
        atualizadoEm: now,
        codigoRecuperacaoCriadoEm: now,
      },
    });
  };

  remove(cnpj: string) {
    return this.prisma.empresasParceiras.delete({
      where: {
        cnpj,
      },
    });
  }

  logout() {
    throw new NotImplementedException();
  }

  refreshToken() {
    throw new NotImplementedException();
  }
}
