import { ApiProperty } from '@nestjs/swagger';
import { DepositMaterialsTransactionDTO } from './deposit-materials-transaction.dto';

export class CreateDepositTransactionDto {
  @ApiProperty()
  usuarioCPF: string;

  @ApiProperty()
  ecopontoId: string;

  @ApiProperty()
  valorTotal: number;

  @ApiProperty({ type: [DepositMaterialsTransactionDTO] })
  materiaisDepositados: DepositMaterialsTransactionDTO[];
}
