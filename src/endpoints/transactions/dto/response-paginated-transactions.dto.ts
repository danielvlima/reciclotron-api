import { ResponseTransactionDto } from './response-transaction.dto';

export class ResponsePaginatedTransactionsDto {
  total: number;
  transacoes: ResponseTransactionDto[];
}
