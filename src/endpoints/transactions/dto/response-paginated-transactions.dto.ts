export class ResponsePaginatedTransactionsDto<T> {
  total: number;
  transacoes: T[];
}
