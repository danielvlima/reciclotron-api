import { CreateDepositTransactionDto } from './create-deposit-transaction.dto';

export class ResponseUnconfirmedDepositTransactionDto extends CreateDepositTransactionDto {
  id: number;
}
