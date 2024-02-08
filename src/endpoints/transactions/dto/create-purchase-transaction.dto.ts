import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseTransactionDto {
  @ApiProperty()
  cupomId: number;

  @ApiProperty()
  qtd: number;

  @ApiProperty()
  valorTotal: number;
}
