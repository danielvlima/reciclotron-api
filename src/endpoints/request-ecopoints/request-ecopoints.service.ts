import { Injectable } from '@nestjs/common';
import {
  CancelRequestEcopointDto,
  CreateRequestEcopointDto,
  UpdateRequestEcopointDto,
} from './dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { MailService } from 'src/shared/modules/mail/mail.service';
import { EcopointsService } from '../ecopoints/ecopoints.service';
import { $Enums, Prisma } from '@prisma/client';

@Injectable()
export class RequestEcopointsService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailService,
    private ecopointsService: EcopointsService,
  ) {}

  create(cnpj: string, createRequestEcopointDto: CreateRequestEcopointDto) {
    return createRequestEcopointDto.ecopontoIds.forEach(async (ecoID) => {
      await this.prisma.solicitacoesEcoponto.create({
        data: {
          cnpjEmpresa: cnpj,
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

  createAddEcopoint(
    cnpj: string,
    createRequestEcopointDto: CreateRequestEcopointDto,
  ) {
    return this.prisma.solicitacoesEcoponto.create({
      data: {
        cnpjEmpresa: cnpj,
        acao: createRequestEcopointDto.acao,
        tipoEcoponto: createRequestEcopointDto.tipoEcoponto,
      },
      include: {
        empresa: {
          select: {
            endereco: true,
          },
        },
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

  findPaginatedNewEcopoints(cnpj: string, skip: number, take: number) {
    return this.prisma.solicitacoesEcoponto.findMany({
      where: {
        cnpjEmpresa: cnpj,
        acao: $Enums.TipoSolicitacaoEcoponto.ADICIONAR,
        atendidoEm: null,
      },
      skip: skip,
      take: take,
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
    let order: Prisma.SolicitacoesEcopontoOrderByWithRelationInput = {
      criadoEm: 'desc',
    };

    if (!adicionarRealizado) {
      condition = {
        atendidoEm: null,
        agendadoPara: null,
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

      order = {
        agendadoPara: 'asc',
      };
    }

    return this.prisma.solicitacoesEcoponto.findMany({
      where: condition,
      orderBy: order,
      skip: skip,
      take: take,
      include: {
        empresa: {
          include: {
            endereco: true,
          },
        },
      },
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

  async update(updateRequestEcopointDto: UpdateRequestEcopointDto) {
    const updatedRequest = await this.prisma.solicitacoesEcoponto.update({
      where: {
        id: updateRequestEcopointDto.id,
      },
      data: {
        atendidoEm: updateRequestEcopointDto.atendidoEm || undefined,
        agendadoPara: updateRequestEcopointDto.agendadoPara || undefined,
      },
      include: {
        empresa: true,
        ecoponto: true,
      },
    });

    const partnerEmail = updatedRequest.empresa.email;
    const acao = updatedRequest.acao;
    const ecoponto = await this.ecopointsService.findOne(updatedRequest.ecopontoId);

    if (updateRequestEcopointDto.atendidoEm) {
      if (acao == 'ADICIONAR') {
        this.mailerService.sendPartnerEcopointSent(
          partnerEmail,
          ecoponto,
          );
      }
      if(acao == 'DEVOLUCAO') {
        this.mailerService.sendPartnerEcopointReturned(
          partnerEmail,
          ecoponto,
          );
      }
      if(acao == 'COLETAR') {
        this.mailerService.sendPartnerCollectionDone(
          partnerEmail,
          ecoponto,
          );
        }
    } else if (updateRequestEcopointDto.agendadoPara) {
      this.mailerService.sendPartnerRequestScheduled(
        partnerEmail,
        acao.toString(),
        `${updateRequestEcopointDto.agendadoPara.getDate().toString().padStart(2, '0')}/${(
          updateRequestEcopointDto.agendadoPara.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}/${updateRequestEcopointDto.agendadoPara.getFullYear()}`,
        )
    }

    return updatedRequest;
  }

  cancel(cnpj: string, data: CancelRequestEcopointDto) {
    return data.ids.forEach(async (element) => {
      await this.prisma.solicitacoesEcoponto
        .delete({
          where: {
            id: element,
            atendidoEm: { equals: null },
            cnpjEmpresa: { equals: cnpj },
          },
          include: {
            empresa: true,
          },
        })
        .catch(() => {
          return null;
        });
    });
  }
}
