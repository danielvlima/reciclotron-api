import { TransactionTypeEnum } from '../enum/transaction-type.enum';

export class ResponseTransactionDto {
  id: number;
  nome: string;
  valorTotal: number;
  realizadoEm: Date;
  tipo: TransactionTypeEnum;
}
