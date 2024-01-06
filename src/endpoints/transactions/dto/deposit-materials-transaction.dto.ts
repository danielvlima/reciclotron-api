import { ApiProperty } from '@nestjs/swagger';

export class DepositMaterialsTransactionDTO {
  transacaoId?: number;

  @ApiProperty()
  materialId: number;

  @ApiProperty()
  quantidade: number;

  @ApiProperty()
  valorTotal: number;
}
