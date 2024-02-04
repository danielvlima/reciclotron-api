import { Injectable } from '@nestjs/common';
import {
  CreateCouponsPurchasedDto,
  GetPaginatedCouponsPurchasedDto,
} from './dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { OrderByCouponsPurchasedEnum } from './enum/order-by-coupons-purchased.enum';

@Injectable()
export class CouponsPurchasedService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCouponsPurchasedDto) {
    return this.prisma.cuponsCompradosUsuario.create({
      data: {
        usuarioCPF: data.usuarioCPF,
        cupomId: data.cupomId,
        expiraEm: data.expiraEm,
        criadoEm: data.criadoEm,
      },

      include: {
        cupom: true,
        usuario: true,
      },
    });
  }

  async findFilters(cpf: string, dateNow: Date) {
    const coupons = await this.prisma.cuponsCompradosUsuario.findMany({
      include: {
        cupom: {
          include: {
            empresa: true,
          },
        },
      },
      where: {
        usuarioCPF: cpf,
        expiraEm: { gte: dateNow },
        utilizadoEm: null,
      },
    });

    return coupons
      .map((item) => item.cupom.empresa.nomeFantasia)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  count(cpf: string, data: GetPaginatedCouponsPurchasedDto, dateNow: Date) {
    return this.prisma.cuponsCompradosUsuario.count({
      where: {
        usuarioCPF: cpf,
        expiraEm: { gte: dateNow },
        utilizadoEm: null,
        cupom: {
          empresa: {
            nomeFantasia: { contains: data.filtro.nomeFantasia ?? '' },
          },
        },
      },
    });
  }

  findPaginated(
    cpf: string,
    data: GetPaginatedCouponsPurchasedDto,
    dateNow: Date,
  ) {
    let orderParams = {};
    switch (data.ordem.opcao) {
      case OrderByCouponsPurchasedEnum.ExpiracaoMaisLonga:
        orderParams = {
          expiraEm: 'desc',
        };
        break;

      case OrderByCouponsPurchasedEnum.ExpiracaoMaisProxima:
        orderParams = {
          expiraEm: 'asc',
        };
        break;

      case OrderByCouponsPurchasedEnum.CompraMaisRecente:
        orderParams = {
          criadoEm: 'desc',
        };
        break;

      case OrderByCouponsPurchasedEnum.CompraMaisAntiga:
        orderParams = {
          criadoEm: 'asc',
        };
        break;
    }
    return this.prisma.cuponsCompradosUsuario.findMany({
      include: {
        cupom: {
          include: {
            empresa: true,
          },
        },
      },
      where: {
        usuarioCPF: cpf,
        expiraEm: { gte: dateNow },
        utilizadoEm: null,
      },
      orderBy: orderParams,
    });
  }
}
