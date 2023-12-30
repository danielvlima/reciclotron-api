import { ApiProperty } from '@nestjs/swagger';

export class DepositMaterialsTransactionDTO {
  @ApiProperty()
  materialId: number;

  @ApiProperty()
  quantidade: number;

  @ApiProperty()
  valorTotal: number;
}
