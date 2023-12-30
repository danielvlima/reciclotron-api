import { TransactionStatusEnum } from '../enum/transactions-type.enum';

export class UpdateTransactionDto {
  id: number;
  status: TransactionStatusEnum;
}
