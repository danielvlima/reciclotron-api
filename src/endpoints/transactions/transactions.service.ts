import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import {
  CreateDepositTransactionDto,
  CreatePurchaseTransactionDto,
  PaginatedTransaction,
  UpdateTransactionDto,
} from './dto';
import { $Enums } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  createDeposit(depositData: CreateDepositTransactionDto) {
    return this.prisma.transacoes.create({
      data: {
        tipo: $Enums.TipoTransacao.CREDITO,
        status: $Enums.StatusTransacao.PENDENTE,
        criadoEm: new Date(),
        usuarioCPF: depositData.usuarioCPF,
        ecopontoId: depositData.ecopontoId,
        valorTotal: depositData.valorTotal,
        materiaisDepositados: {
          createMany: {
            data: depositData.materiaisDepositados,
          },
        },
      },

      include: {
        ecoponto: true,
        materiaisDepositados: true,
        usuario: true,
      },
    });
  }

  createPurchase(purchaseData: CreatePurchaseTransactionDto) {
    const date = new Date();
    return this.prisma.transacoes.create({
      data: {
        tipo: $Enums.TipoTransacao.DEBITO,
        status: $Enums.StatusTransacao.EFETIVADO,
        criadoEm: date,
        finalizadoEm: date,
        usuarioCPF: purchaseData.usuarioCPF,
        valorTotal: purchaseData.valorTotal,
        cupomId: purchaseData.cupomId,
      },

      include: {
        cupom: true,
        materiaisDepositados: true,
        usuario: true,
      },
    });
  }

  count(data: PaginatedTransaction) {
    let filter = {};

    if (data.filterOption.tipo !== 'TODOS') {
      filter = { tipo: { equals: data.filterOption.tipo } };
    }

    return this.prisma.transacoes.count({
      where: {
        AND: [
          { usuarioCPF: { equals: data.usuarioCPF } },
          { status: { equals: $Enums.StatusTransacao.EFETIVADO } },
          filter,
        ],
      },
    });
  }

  findAll(data: PaginatedTransaction) {
    let filter = {};

    if (data.filterOption.tipo !== 'TODOS') {
      filter = { tipo: { equals: data.filterOption.tipo } };
    }

    return this.prisma.transacoes.findMany({
      where: {
        AND: [
          { usuarioCPF: { equals: data.usuarioCPF } },
          { status: { equals: $Enums.StatusTransacao.EFETIVADO } },
          filter,
        ],
      },
      orderBy: [{ id: 'desc' }],
      take: data.take,
      skip: data.skip,
      include: {
        materiaisDepositados: true,
        cupom: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.transacoes.findFirstOrThrow({
      where: { id },
    });
  }

  update(updateTransactionDto: UpdateTransactionDto) {
    return this.prisma.transacoes.update({
      where: {
        id: updateTransactionDto.id,
      },
      data: {
        status: updateTransactionDto.status,
      },
    });
  }
}
