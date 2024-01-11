import { Injectable } from '@nestjs/common';
import {
  CancelRequestEcopointDto,
  CreateRequestEcopointDto,
  PaginatedNewEcopointsRequestDto,
  UpdateRequestEcopointDto,
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

  countAllRequests(adicionarRealizado: boolean, dia?: string) {
    let condition = {};

    if (!adicionarRealizado) {
      condition = {
        atendidoEm: null,
      };
    }

    if (dia) {
      condition = {
        ...condition,
        agendadoPara: dia,
      };
    }

    return this.prisma.solicitacoesEcoponto.count({
      where: condition,
    });
  }

  findAllPaginated(
    skip: number,
    take: number,
    adicionarRealizado: boolean,
    dia?: string,
  ) {
    let condition = {};

    if (!adicionarRealizado) {
      condition = {
        atendidoEm: null,
      };
    }

    if (dia) {
      const range = new Date(dia);
      range.setDate(range.getDate() + 1);
      condition = {
        ...condition,
        agendadoPara: {
          gte: dia,
          lte: range,
        },
      };
    }

    return this.prisma.solicitacoesEcoponto.findMany({
      where: condition,
      orderBy: {
        criadoEm: 'desc',
      },
      skip: skip,
      take: take,
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

  update(updateRequestEcopointDto: UpdateRequestEcopointDto) {
    return this.prisma.solicitacoesEcoponto.update({
      where: {
        id: updateRequestEcopointDto.id,
      },
      data: {
        atendidoEm: updateRequestEcopointDto.atendidoEm || undefined,
        agendadoPara: updateRequestEcopointDto.agendadoPara || undefined,
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
