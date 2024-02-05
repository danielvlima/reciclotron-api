import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import {
  CreateDepositTransactionDto,
  CreatePurchaseTransactionDto,
  PaginatedTransaction,
  PaginatedUnconfirmedTransaction,
  UpdateTransactionDto,
} from './dto';
import { $Enums, Prisma } from '@prisma/client';
import { TransactionStatusEnum } from './enum/transactions-type.enum';
import { NotFoundTransactionException } from 'src/exceptions';
import { PrismaErrorCode } from 'src/shared/enum';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  createDeposit(
    cpf: string,
    title: string,
    depositData: CreateDepositTransactionDto,
  ) {
    return this.prisma.transacoes.create({
      data: {
        tipo: $Enums.TipoTransacao.CREDITO,
        status: $Enums.StatusTransacao.PENDENTE,
        criadoEm: new Date(),
        usuarioCPF: cpf,
        ecopontoId: depositData.ecopontoId,
        titulo: title,
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

  createPurchase(
    cpf: string,
    title: string,
    purchaseData: CreatePurchaseTransactionDto,
  ) {
    const date = new Date();
    return this.prisma.transacoes.create({
      data: {
        tipo: $Enums.TipoTransacao.DEBITO,
        status: $Enums.StatusTransacao.EFETIVADO,
        criadoEm: date,
        finalizadoEm: date,
        usuarioCPF: cpf,
        titulo: title,
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

  count(cpf: string, data: PaginatedTransaction) {
    let filter = {};

    if (data.filterOption.tipo !== 'TODOS') {
      filter = { tipo: { equals: data.filterOption.tipo } };
    }

    return this.prisma.transacoes.count({
      where: {
        AND: [
          { usuarioCPF: { equals: cpf } },
          { status: { equals: $Enums.StatusTransacao.EFETIVADO } },
          filter,
        ],
      },
    });
  }

  findAll(cpf: string, data: PaginatedTransaction) {
    let filter = {};

    if (data.filterOption.tipo !== 'TODOS') {
      filter = { tipo: { equals: data.filterOption.tipo } };
    }

    return this.prisma.transacoes.findMany({
      where: {
        AND: [
          { usuarioCPF: { equals: cpf } },
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
    return this.prisma.transacoes
      .findFirstOrThrow({
        where: { id },
        include: { materiaisDepositados: true },
      })
      .catch((err: Prisma.PrismaClientKnownRequestError) => {
        if (err.code === PrismaErrorCode.NotFoundError) {
          throw new NotFoundTransactionException();
        }
        throw err;
      });
  }

  update(updateTransactionDto: UpdateTransactionDto) {
    let date = new Date();
    if (updateTransactionDto.status === TransactionStatusEnum.PENDENTE) {
      date = null;
    }

    return this.prisma.transacoes.update({
      where: {
        id: updateTransactionDto.id,
      },
      data: {
        status: updateTransactionDto.status,
        finalizadoEm: date,
        valorTotal: updateTransactionDto.valorTotal || undefined,
      },
      include: {
        materiaisDepositados: true,
      },
    });
  }

  countUnconfirmed(ecopontoId: string) {
    return this.prisma.transacoes.count({
      where: {
        status: $Enums.StatusTransacao.PENDENTE,
        tipo: $Enums.TipoTransacao.CREDITO,
        ecopontoId: ecopontoId ? ecopontoId : undefined,
      },
    });
  }

  findAllUnconfirmed(data: PaginatedUnconfirmedTransaction) {
    return this.prisma.transacoes.findMany({
      where: {
        status: $Enums.StatusTransacao.PENDENTE,
        tipo: $Enums.TipoTransacao.CREDITO,
        ecopontoId: data.ecopontoId ? data.ecopontoId : undefined,
      },
      orderBy: [{ id: 'desc' }],
      take: data.take,
      skip: data.skip,
      include: {
        materiaisDepositados: {
          select: {
            materialId: true,
            quantidade: true,
            nomeMaterial: true,
            transacaoId: true,
            valorTotal: true,
            material: true,
          },
        },
      },
    });
  }

  findAllUnconfirmedEcopoints() {
    return this.prisma.transacoes.findMany({
      where: {
        AND: [
          { status: { equals: $Enums.StatusTransacao.PENDENTE } },
          { tipo: { equals: $Enums.TipoTransacao.CREDITO } },
        ],
      },
      orderBy: [{ ecopontoId: 'asc' }],
      select: {
        ecopontoId: true,
      },
    });
  }
}
