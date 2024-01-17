import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatusEnum } from '../enum/transactions-type.enum';

export class UpdateTransactionDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: ['PENDENTE', 'EFETIVADO', 'REJEITADO'] })
  status: TransactionStatusEnum;

  @ApiProperty()
  valorTotal?: number;
}
