import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';

@Injectable()
export class StaticsService {
  constructor(private prisma: PrismaService) {}

  countAllRedeemedCoupons(initialDate: Date, finalDate: Date, cnpj?: string) {
    return this.prisma.cuponsCompradosUsuario.count({
      where: {
        cupom: {
          cnpjEmpresa: cnpj,
        },
        criadoEm: {
          gte: initialDate,
          lte: finalDate,
        },
      },
    });
  }

  countAllUtilizedCoupons(initialDate: Date, finalDate: Date, cnpj?: string) {
    return this.prisma.cuponsCompradosUsuario.count({
      where: {
        cupom: {
          cnpjEmpresa: cnpj,
        },
        utilizadoEm: {
          not: null,
          gte: initialDate,
          lte: finalDate,
        },
      },
    });
  }

  countAllUserRedeemedCoupons(
    cnpj: string,
    initialDate: Date,
    finalDate: Date,
  ) {
    return this.prisma.cuponsCompradosUsuario.findMany({
      where: {
        cupom: {
          cnpjEmpresa: cnpj,
        },
        criadoEm: {
          gte: initialDate,
          lte: finalDate,
        },
      },
      distinct: ['usuarioCPF'],
    });
  }

  countAllUserUtilizedCoupons(
    cnpj: string,
    initialDate: Date,
    finalDate: Date,
  ) {
    return this.prisma.cuponsCompradosUsuario.findMany({
      where: {
        cupom: {
          cnpjEmpresa: cnpj,
        },
        utilizadoEm: {
          not: null,
          gte: initialDate,
          lte: finalDate,
        },
      },
      distinct: ['usuarioCPF'],
    });
  }

  countAllActiveParners() {
    return this.prisma.empresasParceiras.count({
      where: {
        ativo: true,
      },
    });
  }

  countAllActiveEcopoints() {
    return this.prisma.ecopontos.count({
      where: {
        ativo: true,
      },
    });
  }

  countAllUsers() {
    return this.prisma.usuarios.count();
  }

  countAllReciclopointsGenerated(initialDate: Date, finalDate: Date) {
    return this.prisma.transacoes.aggregate({
      _sum: {
        valorTotal: true,
      },
      where: {
        tipo: $Enums.TipoTransacao.CREDITO,
        status: $Enums.StatusTransacao.EFETIVADO,
        finalizadoEm: {
          not: null,
          gte: initialDate,
          lte: finalDate,
        },
      },
    });
  }

  findAll() {
    return `This action returns all statics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} static`;
  }
}
