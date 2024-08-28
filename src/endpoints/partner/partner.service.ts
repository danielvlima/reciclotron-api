import { Injectable } from '@nestjs/common';
import {
  CreatePartnerDto,
  UpdatePartnerDto,
  UpdateAddressPartnerDto,
  GetPaginatedPartnerDto,
  FilterOptionsPartnerDto,
} from './dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';
import { TokenService } from 'src/shared/modules/auth/token.service';
import { Prisma } from '@prisma/client';
import { NotFoundPartnerException } from 'src/exceptions';
import { PrismaErrorCode } from 'src/shared/enum';
import { UpdateProfileDataException } from 'src/exceptions/update-profile-data.exception';

@Injectable()
export class PartnerService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async updateRtHash(cnpj: string, rt: string) {
    const hash = CryptoModule.sha256(rt);
    await this.prisma.empresasParceiras.update({
      where: {
        cnpj: cnpj,
      },
      data: {
        token: hash,
        atualizadoEm: new Date(),
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

    if (data.ativo !== undefined) {
      filter.push({
        ativo: {
          equals: data.ativo,
        },
      });
    }

    return this.prisma.empresasParceiras.count({
      where: {
        AND: [
          {
            OR: [
              {
                cnpj: {
                  contains: data.busca ?? '',
                },
              },
              {
                nomeFantasia: {
                  contains: data.busca ?? '',
                },
              },
              {
                ramo: {
                  contains: data.busca ?? '',
                },
              },
            ],
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

    if (data.filtro.ativo !== undefined) {
      filter.push({
        ativo: {
          equals: data.filtro.ativo,
        },
      });
    }

    return this.prisma.empresasParceiras.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                cnpj: {
                  contains: data.filtro.busca ?? '',
                },
              },
              {
                nomeFantasia: {
                  contains: data.filtro.busca ?? '',
                },
              },
              {
                ramo: {
                  contains: data.filtro.busca ?? '',
                },
              },
            ],
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
    return this.prisma.empresasParceiras
      .findFirstOrThrow({
        where: {
          email,
        },
        include: {
          endereco: true,
        },
      })
      .catch((err: Prisma.PrismaClientKnownRequestError) => {
        if (err.code === PrismaErrorCode.NotFoundError) {
          throw new NotFoundPartnerException();
        }
        throw err;
      });
  }

  findOneWithCnpj(cnpj: string) {
    return this.prisma.empresasParceiras
      .findFirstOrThrow({
        where: {
          cnpj,
        },
        include: {
          endereco: true,
        },
      })
      .catch((err: Prisma.PrismaClientKnownRequestError) => {
        if (err.code === PrismaErrorCode.NotFoundError) {
          throw new NotFoundPartnerException();
        }
        throw err;
      });
  }

  update(data: UpdatePartnerDto, newCnpj?: string) {
    return this.prisma.empresasParceiras
      .update({
        where: {
          cnpj: data.cnpj,
        },

        data: {
          cnpj: newCnpj || undefined,
          logo: data.logo || undefined,
          email: data.email || undefined,
          senha: data.senha || undefined,
          telefone: data.telefone || undefined,
          nomeFantasia: data.nomeFantasia || undefined,
          razaoSocial: data.razaoSocial || undefined,
          ramo: data.ramo || undefined,
          ativo: data.ativo,
          tipoEmpresa: data.tipoEmpresa || undefined,
          enderecolojaOnline: data.enderecolojaOnline || undefined,
          atualizadoEm: new Date(),
          codigoRecuperacao: null,
          codigoRecuperacaoCriadoEm: null,
          codigoRecuperacaoVerificado: null,
        },
        include: {
          endereco: true,
        },
      })
      .catch((err: Prisma.PrismaClientKnownRequestError) => {
        if (err.code === PrismaErrorCode.UniqueContrantViolation) {
          throw new UpdateProfileDataException();
        }
        throw err;
      });
  }

  async updateAddress(cnpj: string, updateAddress: UpdateAddressPartnerDto) {
    const partner = await this.prisma.empresasParceiras.findFirst({
      where: {
        cnpj,
      },
    });

    if (!partner) {
      throw new UpdateProfileDataException();
    }

    this.prisma.enderecos
      .upsert({
        where: {
          cnpjEmpresa: cnpj,
        },
        update: {
          rua: updateAddress.rua,
          numero: updateAddress.numero,
          complemento: updateAddress.complemento,
          bairro: updateAddress.bairro,
          cidade: updateAddress.cidade,
          uf: updateAddress.uf,
          cep: updateAddress.cep,
          lat: updateAddress.lat,
          long: updateAddress.long,
        },

        create: {
          rua: updateAddress.rua,
          numero: updateAddress.numero,
          complemento: updateAddress.complemento,
          bairro: updateAddress.bairro,
          cidade: updateAddress.cidade,
          uf: updateAddress.uf,
          cep: updateAddress.cep,
          lat: updateAddress.lat,
          long: updateAddress.long,
          empresa: {
            connect: partner,
          },
        },
      })
      .catch((err: Prisma.PrismaClientKnownRequestError) => {
        if (err.code === PrismaErrorCode.UniqueContrantViolation) {
          throw new UpdateProfileDataException();
        }
        throw err;
      });

    return partner;
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
        codigoRecuperacaoVerificado: false,
      },
    });
  };

  checkedRecoveryCode(cnpj: any) {
    const now = new Date();
    return this.prisma.empresasParceiras.update({
      where: {
        cnpj,
      },

      data: {
        atualizadoEm: now,
        codigoRecuperacaoVerificado: true,
      },
    });
  }

  remove(cnpj: string) {
    return this.prisma
      .$transaction([
        this.prisma.cuponsDesconto.updateMany({
          where: {
            cnpjEmpresa: cnpj,
          },
          data: {
            cnpjEmpresa: null,
            ativo: false,
          },
        }),
        this.prisma.empresasParceiras.delete({
          where: {
            cnpj,
          },
        }),
      ])
      .catch((err: Prisma.PrismaClientKnownRequestError) => {
        if (err.code === PrismaErrorCode.NotFoundError) {
          throw new NotFoundPartnerException();
        }
        throw err;
      });
  }

  logout(cnpj: string) {
    return this.prisma.empresasParceiras.updateMany({
      where: {
        cnpj: cnpj,
        token: {
          not: null,
        },
      },
      data: {
        token: null,
      },
    });
  }

  async refreshToken(cnpj: string, rt: string) {
    const partner = await this.findOneWithCnpj(cnpj);
    CryptoModule.checkRtToken(partner.token, rt);
    const tokens = await this.tokenService.getTokens(
      cnpj,
      partner.email,
      'EMPRESA',
    );

    await this.updateRtHash(cnpj, tokens.refresh_token);
    return tokens;
  }
}
