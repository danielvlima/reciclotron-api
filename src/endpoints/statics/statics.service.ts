import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';

@Injectable()
export class StaticsService {
  constructor(private prisma: PrismaService) {}

  allRedeemedCoupons(cnpj: string, initialDate: Date, finalDate: Date) {
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

  allUtilizedCoupons(cnpj: string, initialDate: Date, finalDate: Date) {
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

  allUserRedeemedCoupons(cnpj: string, initialDate: Date, finalDate: Date) {
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

  allUserUtilizedCoupons(cnpj: string, initialDate: Date, finalDate: Date) {
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

  findAll() {
    return `This action returns all statics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} static`;
  }
}
