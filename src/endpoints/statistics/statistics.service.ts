import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { UserGenderEnum } from '../users/enum/user-gender.enum';
import { FieldCountDto } from './dto';
import { TypeEcopointEnum } from 'src/shared/enum';

export interface DataItem {
  name: string;
  c1: number;
}

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  countAllRedeemedCoupons(initialDate: Date, finalDate: Date, cnpj?: string) {
    return this.prisma.cuponsCompradosUsuario.count({
      where: {
        cupom: {
          cnpjEmpresa: cnpj,
        },
        criadoEm: {
          gte: initialDate,
          lt: finalDate,
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
            lt: finalDate,
          },
        },
      })
      .then((responseQuery) => {
        return responseQuery.map<DataItem>((el) => {
          return {
            name: el.cupomNome,
            c1: el._count,
          };
        });
      });
  }

  listAllRedeemedCouponsByUser(
    initialDate: Date,
    finalDate: Date,
    cnpj: string,
  ) {
    const list = [];

    const genders = Object.values(UserGenderEnum);

    genders.forEach(async (g) => {
      const result = await this.prisma.cuponsCompradosUsuario
        .groupBy({
          by: ['cupomNome'],
          _count: true,
          where: {
            cupom: {
              cnpjEmpresa: cnpj,
            },
            usuario: {
              generoUsuario: g,
            },
            criadoEm: {
              gte: initialDate,
              lt: finalDate,
            },
          },
        })
        .then((responseQuery) => {
          return responseQuery.map<DataItem>((el) => {
            return {
              name: el.cupomNome,
              c1: el._count,
            };
          });
        });
      if (result.length) {
        list.push({
          genero: g,
          lista: result,
        });
      }
    });

    return list;
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
          lt: finalDate,
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
            lt: finalDate,
          },
        },
      })
      .then((responseQuery) => {
        return responseQuery.map<DataItem>((el) => {
          return {
            name: el.cupomNome,
            c1: el._count,
          };
        });
      });
  }

  listAllUtilizedCouponsByUser(
    initialDate: Date,
    finalDate: Date,
    cnpj: string,
  ) {
    const list = [];

    const genders = Object.values(UserGenderEnum);

    genders.forEach(async (g) => {
      const result = await this.prisma.cuponsCompradosUsuario
        .groupBy({
          by: ['cupomNome'],
          _count: true,
          where: {
            cupom: {
              cnpjEmpresa: cnpj,
            },
            usuario: {
              generoUsuario: g,
            },
            utilizadoEm: {
              not: null,
              gte: initialDate,
              lt: finalDate,
            },
          },
        })
        .then((responseQuery) => {
          return responseQuery.map<DataItem>((el) => {
            return {
              name: el.cupomNome,
              c1: el._count,
            };
          });
        });
      if (result.length) {
        list.push({
          genero: g,
          lista: result,
        });
      }
    });

    return list;
  }

  countAllUserRedeemedCoupons(
    initialDate: Date,
    finalDate: Date,
    cnpj: string,
  ) {
    return this.prisma.cuponsCompradosUsuario.findMany({
      where: {
        cupom: {
          cnpjEmpresa: cnpj,
        },
        criadoEm: {
          gte: initialDate,
          lt: finalDate,
        },
      },
      distinct: ['usuarioCPF'],
    });
  }

  countAllUserUtilizedCoupons(
    initialDate: Date,
    finalDate: Date,
    cnpj: string,
  ) {
    return this.prisma.cuponsCompradosUsuario.findMany({
      where: {
        cupom: {
          cnpjEmpresa: cnpj,
        },
        utilizadoEm: {
          not: null,
          gte: initialDate,
          lt: finalDate,
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

  async listAllActiveParnersByRamoAndCity() {
    const address = await this.prisma.enderecos.groupBy({
      by: ['cidade', 'uf'],
    });

    let list = [];

    address.forEach(async (a) => {
      const results = await this.prisma.empresasParceiras.groupBy({
        by: ['ramo'],
        _count: true,
        where: {
          ativo: true,
          endereco: {
            cidade: a.cidade,
            uf: a.uf,
          },
        },
      });

      const _list = results.map((r) => {
        return {
          cidade: `${a.cidade} - ${a.uf}`,
          ramo: r.ramo,
          total: r._count,
        };
      });
      list = list.concat(_list);
    });

    return list;
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
        _count: true,
        where: {
          ativo: true,
        },
      })
      .then((responseQuery) => {
        return responseQuery.map<DataItem>((el) => {
          return {
            name: TypeEcopointEnum[el.tipo],
            c1: el._count,
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
          lt: finalDate,
        },
      },
    });
  }

  countAllUsersByGender(initialDate?: Date, finalDate?: Date) {
    return this.prisma.usuarios
      .groupBy({
        by: ['generoUsuario'],
        _count: true,
        where: {
          nivelPrivilegio: $Enums.RegraPriviegio.USUARIO,
          criadoEm: {
            gte: initialDate,
            lt: finalDate,
          },
        },
      })
      .then((responseQuery) => {
        return responseQuery.map<DataItem>((el) => {
          return {
            name: UserGenderEnum[el.generoUsuario],
            c1: el._count,
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
          lt: finalDate,
        },
      },
    });
  }

  listMaterials(initialDate: Date, finalDate: Date) {
    return this.prisma.materiaisDepositados
      .groupBy({
        by: ['nomeMaterial'],
        _count: true,
        where: {
          transacoes: {
            finalizadoEm: {
              not: null,
              gte: initialDate,
              lt: finalDate,
            },
            status: $Enums.StatusTransacao.EFETIVADO,
          },
        },
      })
      .then((responseQuery) => {
        return responseQuery.map<DataItem>((el) => {
          return {
            name: el.nomeMaterial,
            c1: el._count,
          };
        });
      });
  }

  async listMaterialsByEcopoints(initialDate: Date, finalDate: Date) {
    const ecopoints = await this.prisma.transacoes.groupBy({
      by: ['ecopontoId'],
      where: {
        finalizadoEm: {
          not: null,
          gte: initialDate,
          lt: finalDate,
        },
        status: $Enums.StatusTransacao.EFETIVADO,
        tipo: $Enums.TipoTransacao.CREDITO,
      },
    });

    const list = [];

    ecopoints.forEach(async (eco) => {
      const response = await this.prisma.materiaisDepositados
        .groupBy({
          by: ['nomeMaterial'],
          _count: true,
          where: {
            transacoes: {
              finalizadoEm: {
                not: null,
                gte: initialDate,
                lt: finalDate,
              },
              status: $Enums.StatusTransacao.EFETIVADO,
              ecopontoId: eco.ecopontoId,
            },
          },
        })
        .then((responseQuery) => {
          return responseQuery.map<DataItem>((el) => {
            return {
              name: el.nomeMaterial,
              c1: el._count,
            };
          });
        });

      list.push({
        ecopontoID: eco.ecopontoId,
        lista: response,
      });
    });

    return list;
  }

  findAll() {
    return `This action returns all statistics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} static`;
  }
}
