import { ResponseDepositMaterialsTransactionDTO } from './response-deposit-materials-transaction.dto';

export class ResponseUnconfirmedDepositTransactionDto {
  id: number;
  usuarioCPF: string;
  ecopontoId: string;
  valorTotal: number;
  materiaisDepositados: ResponseDepositMaterialsTransactionDTO[];
}
