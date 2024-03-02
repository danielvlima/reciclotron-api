import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { UserGenderEnum } from '../users/enum/user-gender.enum';
import { FieldCountDto } from './dto';
import { TypeEcopointEnum } from 'src/shared/enum';

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

  listAllRedeemedCoupons(initialDate: Date, finalDate: Date, cnpj: string) {
    return this.prisma.cuponsCompradosUsuario
      .groupBy({
        by: ['cupomNome'],
        _count: true,
        where: {
          cupom: {
            cnpjEmpresa: cnpj,
          },
          criadoEm: {
            gte: initialDate,
            lte: finalDate,
          },
        },
      })
      .then((responseQuery) => {
        return responseQuery.map<FieldCountDto>((el) => {
          return {
            campo: el.cupomNome,
            total: el._count,
          };
        });
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

  listAllUtilizedCoupons(initialDate: Date, finalDate: Date, cnpj: string) {
    return this.prisma.cuponsCompradosUsuario
      .groupBy({
        by: ['cupomNome'],
        _count: true,
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
      })
      .then((responseQuery) => {
        return responseQuery.map<FieldCountDto>((el) => {
          return {
            campo: el.cupomNome,
            total: el._count,
          };
        });
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

  countAllActiveEcopointsByType() {
    return this.prisma.ecopontos
      .groupBy({
        by: ['tipo'],
        _count: { tipo: true },
        where: {
          ativo: true,
        },
      })
      .then((responseQuery) => {
        return responseQuery.map<FieldCountDto>((el) => {
          return {
            campo: TypeEcopointEnum[el.tipo],
            total: el._count.tipo,
          };
        });
      });
  }

  countAllUsers(initialDate?: Date, finalDate?: Date) {
    return this.prisma.usuarios.count({
      where: {
        nivelPrivilegio: $Enums.RegraPriviegio.USUARIO,
        criadoEm: {
          gte: initialDate,
          lte: finalDate,
        },
      },
    });
  }

  countAllUsersByGender(initialDate?: Date, finalDate?: Date) {
    return this.prisma.usuarios
      .groupBy({
        by: ['generoUsuario'],
        _count: { generoUsuario: true },
        where: {
          nivelPrivilegio: $Enums.RegraPriviegio.USUARIO,
          criadoEm: {
            gte: initialDate,
            lte: finalDate,
          },
        },
      })
      .then((responseQuery) => {
        return responseQuery.map<FieldCountDto>((el) => {
          return {
            campo: UserGenderEnum[el.generoUsuario],
            total: el._count.generoUsuario,
          };
        });
      });
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
