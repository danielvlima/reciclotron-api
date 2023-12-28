import { Injectable } from '@nestjs/common';
import {
  CreatePartnerDto,
  UpdatePartnerDto,
  UpdateAddressPartnerDto,
} from './dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';

@Injectable()
export class PartnerService {
  constructor(private prisma: PrismaService) {}

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

  findAll() {
    return `This action returns all partner`;
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

  update(cnpj: string, data: UpdatePartnerDto) {
    return this.prisma.empresasParceiras.update({
      where: {
        cnpj,
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
}
