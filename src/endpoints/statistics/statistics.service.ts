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

  listGendersByCouponUsage(initialDate: Date, finalDate: Date, cnpj: string) {
    return this.prisma.usuarios.groupBy({
      by: ['generoUsuario'],
      _count: {
        _all: true
      },
      where: {
        cuponsCompradosUsuario: {
          some: {
            cupom: {
              cnpjEmpresa: cnpj
            },
            utilizadoEm: {
              not: null,
              gte: initialDate,
              lt: finalDate
            }
          }
        }
      }
    })
    .then((responseQuery) => {
      const format = (generoUsuario: string) => {
        switch (generoUsuario) {
          case 'HOMEM_CIS':
            return 'Homem Cis';
          case 'HOMEM_TRANS':
            return 'Homem Trans';
          case 'MULHER_CIS':
            return 'Mulher Cis';
          case 'MULHER_TRANS':
            return 'Mulher Trans';
          case 'NAO_BINARIO':
            return 'Não Binário';
          default:
            return 'Outro';
        }
      };
  
      const genderCounts = responseQuery.map((el) => ({
        name: format(el.generoUsuario),
        c1: el._count._all
      }));
  
      return genderCounts;
    });
  }

  listGendersByCouponRedeem(initialDate: Date, finalDate: Date, cnpj: string) {
    return this.prisma.usuarios.groupBy({
      by: ['generoUsuario'],
      _count: {
        _all: true
      },
      where: {
        cuponsCompradosUsuario: {
          some: {
            cupom: {
              cnpjEmpresa: cnpj
            },
            criadoEm: {
              gte: initialDate,
              lt: finalDate
            }
          }
        }
      }
    })
    .then((responseQuery) => {
      const format = (generoUsuario: string) => {
        switch (generoUsuario) {
          case 'HOMEM_CIS':
            return 'Homem Cis';
          case 'HOMEM_TRANS':
            return 'Homem Trans';
          case 'MULHER_CIS':
            return 'Mulher Cis';
          case 'MULHER_TRANS':
            return 'Mulher Trans';
          case 'NAO_BINARIO':
            return 'Não Binário';
          default:
            return 'Outro';
        }
      };
  
      const genderCounts = responseQuery.map((el) => ({
        name: format(el.generoUsuario),
        c1: el._count._all
      }));

      return genderCounts;
    });
  }

  listAgeRangesByCouponUsage(initialDate: Date, finalDate: Date, cnpj: string) {
    return this.prisma.usuarios.findMany({
      where: {
        cuponsCompradosUsuario: {
          some: {
            cupom: {
              cnpjEmpresa: cnpj
            },
            utilizadoEm: {
              not: null,
              gte: initialDate,
              lt: finalDate
            }
          }
        }
      },
      select: {
        dataAniversario: true,
        cuponsCompradosUsuario: {
          where: {
            utilizadoEm: {
              not: null,
              gte: initialDate,
              lt: finalDate
            }
          },
          select: {
            utilizadoEm: true,
          }
        }
      }
    }).then((users) => {
      const calculateAge = (birthDate: Date, usedDate: Date) => {
        const ageDiff = new Date(usedDate).getFullYear() - new Date(birthDate).getFullYear();
        const birthMonthDiff = new Date(usedDate).getMonth() - new Date(birthDate).getMonth();
        if (birthMonthDiff < 0 || (birthMonthDiff === 0 && new Date(usedDate).getDate() < new Date(birthDate).getDate())) {
          return ageDiff - 1;
        }
        return ageDiff;
      };
  
      const categorizeAgeRange = (age: number) => {
        if (age <= 18) return 'Até 18';
        if (age <= 23) return '19-23';
        if (age <= 28) return '24-28';
        if (age <= 32) return '29-32';
        if (age <= 36) return '33-36';
        if (age <= 40) return '37-40';
        if (age <= 44) return '41-44';
        if (age <= 48) return '45-48';
        if (age <= 52) return '49-52';
        if (age <= 56) return '53-56';
        if (age <= 59) return '57-59';
        return '60+';
      };
  
      const ageRangeCounts = users.reduce((acc, user) => {
        const age = calculateAge(user.dataAniversario, user.cuponsCompradosUsuario[0].utilizadoEm);
        const ageRange = categorizeAgeRange(age);
        if (!acc[ageRange]) {
          acc[ageRange] = 0;
        }
        acc[ageRange] += 1;
        return acc;
      }, {} as Record<string, number>);
  
      const result = Object.keys(ageRangeCounts).map((ageRange) => ({
        name: ageRange,
        c1: ageRangeCounts[ageRange]
      }));
  
      return result;
    });
  }

listAgeRangesByCouponRedeem(initialDate: Date, finalDate: Date, cnpj: string) {
    return this.prisma.usuarios.findMany({
      where: {
        cuponsCompradosUsuario: {
          some: {
            cupom: {
              cnpjEmpresa: cnpj
            },
            criadoEm: {
              gte: initialDate,
              lt: finalDate,
            },
          }
        }
      },
      select: {
        dataAniversario: true,
        cuponsCompradosUsuario: {
          where: {
            criadoEm: {
              gte: initialDate,
              lt: finalDate
            }
          },
          select: {
            criadoEm: true,
          }
        }
      }
    }).then((users) => {
      const calculateAge = (birthDate: Date, usedDate: Date) => {
        const ageDiff = new Date(usedDate).getFullYear() - new Date(birthDate).getFullYear();
        const birthMonthDiff = new Date(usedDate).getMonth() - new Date(birthDate).getMonth();
        if (birthMonthDiff < 0 || (birthMonthDiff === 0 && new Date(usedDate).getDate() < new Date(birthDate).getDate())) {
          return ageDiff - 1;
        }
        return ageDiff;
      };
  
      const categorizeAgeRange = (age: number) => {
        if (age <= 18) return 'Até 18';
        if (age <= 23) return '19-23';
        if (age <= 28) return '24-28';
        if (age <= 32) return '29-32';
        if (age <= 36) return '33-36';
        if (age <= 40) return '37-40';
        if (age <= 44) return '41-44';
        if (age <= 48) return '45-48';
        if (age <= 52) return '49-52';
        if (age <= 56) return '53-56';
        if (age <= 59) return '57-59';
        return '60+';
      };
  
      const ageRangeCounts = users.reduce((acc, user) => {
        const age = calculateAge(user.dataAniversario, user.cuponsCompradosUsuario[0].criadoEm);
        const ageRange = categorizeAgeRange(age);
        if (!acc[ageRange]) {
          acc[ageRange] = 0;
        }
        acc[ageRange] += 1;
        return acc;
      }, {} as Record<string, number>);
  
      const result = Object.keys(ageRangeCounts).map((ageRange) => ({
        name: ageRange,
        c1: ageRangeCounts[ageRange]
      }));
  
      return result;
    });
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
