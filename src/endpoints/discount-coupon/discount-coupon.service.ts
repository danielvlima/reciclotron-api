import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import {
  CreateDiscountCouponDto,
  UpdateDiscountCouponDto,
  PaginatedPartnerCouponsDto,
} from './dto';

@Injectable()
export class DiscountCouponService {
  constructor(private prisma: PrismaService) {}

  create(createDiscountCouponDto: CreateDiscountCouponDto) {
    return this.prisma.cuponsDesconto.create({
      data: createDiscountCouponDto,
    });
  }

  findAll(skip?: number, take?: number) {
    return this.prisma.cuponsDesconto.findMany({
      where: {
        ativo: true,
        quantidadeDisponiveis: {
          gte: 1,
        },
      },
      include: {
        empresa: {
          select: {
            logo: true,
            nomeFantasia: true,
            ramo: true,
          },
        },
      },
      skip: skip,
      take: take,
    });
  }

  search(value: string) {
    return this.prisma.cuponsDesconto.findMany({
      where: {
        ativo: true,
        quantidadeDisponiveis: { gte: 1 },
        OR: [
          {
            nome: {
              contains: value,
            },
          },
          {
            empresa: {
              nomeFantasia: { contains: value },
            },
          },
          {
            empresa: {
              ramo: { contains: value },
            },
          },
        ],
      },
      include: {
        empresa: {
          select: {
            ramo: true,
            nomeFantasia: true,
            logo: true,
          },
        },
      },
    });
  }

  findRamos() {
    return this.prisma.empresasParceiras.findMany({
      select: {
        ramo: true,
      },
      distinct: ['ramo'],
    });
  }

  findByRamos(ramo: string, take: number) {
    return this.prisma.cuponsDesconto.findMany({
      where: {
        empresa: {
          ramo: ramo,
        },
        ativo: {
          equals: true,
        },
        quantidadeDisponiveis: {
          gte: 1,
        },
      },
      take: take,
      include: {
        empresa: {
          select: {
            ramo: true,
            nomeFantasia: true,
            logo: true,
          },
        },
      },
    });
  }

  countPartner(data: PaginatedPartnerCouponsDto) {
    let filter = {};
    let activeFilter = {};
    switch (data.filterOptions.filtro) {
      case 'desativados':
        activeFilter = { ativo: { equals: false } };
        break;

      case 'todosVendidos':
        filter = { quantidadeDisponiveis: { equals: 0 } };
        break;

      case 'ativosDisponiveis':
        activeFilter = { ativo: { equals: true } };
        filter = { quantidadeDisponiveis: { gte: 1 } };
        break;

      case '':
        break;
    }

    return this.prisma.cuponsDesconto.count({
      where: {
        AND: [{ cnpjEmpresa: { equals: data.cnpj } }, filter, activeFilter],
      },
    });
  }

  findPaginatedForPartner(data: PaginatedPartnerCouponsDto) {
    let filter = {};
    let activeFilter = {};
    switch (data.filterOptions.filtro) {
      case 'desativados':
        activeFilter = { ativo: { equals: false } };
        break;

      case 'todosVendidos':
        filter = { quantidadeDisponiveis: { equals: 0 } };
        break;

      case 'ativosDisponiveis':
        activeFilter = { ativo: { equals: true } };
        filter = { quantidadeDisponiveis: { gte: 1 } };
        break;

      case '':
        break;
    }

    return this.prisma.cuponsDesconto.findMany({
      where: {
        AND: [
          { cnpjEmpresa: { equals: data.cnpj } },
          {
            nome: {
              contains: data.filterOptions.busca,
            },
          },
          filter,
          activeFilter,
        ],
      },
      skip: data.skip,
      take: data.take,
      orderBy: {
        criadoEm: 'desc',
      },
    });
  }

  update(updateDiscountCouponDto: UpdateDiscountCouponDto) {
    return this.prisma.cuponsDesconto.update({
      where: {
        id: updateDiscountCouponDto.id,
      },

      data: {
        nome: updateDiscountCouponDto.nome || undefined,
        valor: updateDiscountCouponDto.valor || undefined,
        quantidadeDisponiveis:
          updateDiscountCouponDto.quantidadeDisponiveis || undefined,
        ativo: updateDiscountCouponDto.ativo ?? undefined,
        regras: updateDiscountCouponDto.regras || undefined,
        atualizadoEm: new Date(),
      },
    });
  }

  remove(cnpj: string, id: number) {
    return this.prisma.cuponsDesconto.delete({
      where: {
        id,
        cnpjEmpresa: cnpj,
      },
    });
  }
}
