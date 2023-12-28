import { Injectable } from '@nestjs/common';
import {
  CancelRequestEcopointDto,
  CreateRequestEcopointDto,
  PaginatedNewEcopointsRequestDto,
} from './dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { $Enums } from '@prisma/client';

@Injectable()
export class RequestEcopointsService {
  constructor(private prisma: PrismaService) {}

  create(createRequestEcopointDto: CreateRequestEcopointDto) {
    return createRequestEcopointDto.ecopontoIds.forEach(async (ecoID) => {
      await this.prisma.solicitacoesEcoponto.create({
        data: {
          cnpjEmpresa: createRequestEcopointDto.cnpj,
          ecopontoId: ecoID,
          acao: createRequestEcopointDto.acao,
        },
        include: {
          ecoponto: true,
          empresa: true,
        },
      });
    });
  }

  createAddEcopoint(createRequestEcopointDto: CreateRequestEcopointDto) {
    return this.prisma.solicitacoesEcoponto.create({
      data: {
        cnpjEmpresa: createRequestEcopointDto.cnpj,
        acao: createRequestEcopointDto.acao,
        tipoEcoponto: createRequestEcopointDto.tipoEcoponto,
      },
      include: {
        empresa: true,
      },
    });
  }

  countNewEcopoints(cnpj: string) {
    return this.prisma.solicitacoesEcoponto.count({
      where: {
        AND: [
          { cnpjEmpresa: { equals: cnpj } },
          { acao: { equals: $Enums.TipoSolicitacaoEcoponto.ADICIONAR } },
          { atendidoEm: { equals: null } },
        ],
      },
    });
  }

  findPaginatedNewEcopoints(data: PaginatedNewEcopointsRequestDto) {
    return this.prisma.solicitacoesEcoponto.findMany({
      where: {
        cnpjEmpresa: data.cnpj,
        acao: $Enums.TipoSolicitacaoEcoponto.ADICIONAR,
        atendidoEm: null,
      },
      skip: data.skip,
      take: data.take,
    });
  }

  findOneRequest(ecopointId: string) {
    return this.prisma.solicitacoesEcoponto.findFirst({
      where: {
        ecopontoId: ecopointId,
        atendidoEm: null,
      },
    });
  }

  cancel(data: CancelRequestEcopointDto) {
    return data.ids.forEach(async (element) => {
      await this.prisma.solicitacoesEcoponto.delete({
        where: {
          id: element,
          atendidoEm: { equals: null },
          cnpjEmpresa: { equals: data.cnpj },
        },
        include: {
          empresa: true,
        },
      });
    });
  }
}
