import { ApiProperty } from '@nestjs/swagger';
import { TransactionTypeEnum } from '../enum/transaction-type.enum';

export class FilterTransactionsOptionsDto {
  @ApiProperty({
    enum: ['CREDITO', 'DEBITO', 'TODOS'],
  })
  tipo: TransactionTypeEnum;
}
