import { Injectable } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { UpdateAddressPartnerDto } from './dto/update-address-partner.dto';

@Injectable()
export class PartnerService {
  constructor(private prisma: PrismaService) {}

  create(createPartnerDto: CreatePartnerDto) {
    return this.prisma.empresasParceiras.create({
      data: createPartnerDto,
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

  update(cnpj: string, updatePartnerDto: UpdatePartnerDto) {
    return this.prisma.empresasParceiras.update({
      where: {
        cnpj,
      },

      data: {
        ...updatePartnerDto,
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
          where: { id: data.id! },
          data: updateAddress,
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
