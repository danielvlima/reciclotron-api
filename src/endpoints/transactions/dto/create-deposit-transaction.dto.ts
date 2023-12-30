import { DepositMaterialsTransactionDTO } from './deposit-materials-transaction.dto';

export class CreateDepositTransactionDto {
  usuarioCPF: string;
  ecopontoId: string;
  valorTotal: number;
  materiaisDepositados: DepositMaterialsTransactionDTO[];
}
