import {
  ResponseTransactionDto,
  ResponseUnconfirmedDepositTransactionDto,
} from '../dto';
import { Transaction } from '../entities/transaction.entity';
import { TransactionTypeEnum } from '../enum/transaction-type.enum';

export const toTransactionDTO = (data: Transaction): ResponseTransactionDto => {
  return {
    id: Number(data.id),
    nome: data.titulo,
    realizadoEm: data.finalizadoEm!,
    tipo: TransactionTypeEnum[data.tipo],
    valorTotal: data.valorTotal,
  };
};

export const toUnconfirmedTransactionDTO = (
  data: Transaction,
): ResponseUnconfirmedDepositTransactionDto => {
  return {
    id: Number(data.id),
    usuarioCPF: data.usuarioCPF,
    ecopontoId: data.ecopontoId!,
    valorTotal: data.valorTotal,
    materiaisDepositados: data.materiaisDepositados.map((el) => {
      return {
        transacaoId: Number(el.transacaoId),
        materialId: Number(el.materialId),
        quantidade: el.quantidade,
        valorTotal: el.valorTotal,
        nome: el.nomeMaterial,
      };
    }),
  };
};
