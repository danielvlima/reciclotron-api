import { ResponseDepositMaterialsTransactionDTO } from './response-deposit-materials-transaction.dto';

export class ResponseUnconfirmedDepositTransactionDto {
  id: number;
  usuarioCPF: string;
  ecopontoId: string;
  lat?: number;
  long?: number;
  valorTotal: number;
  materiaisDepositados: ResponseDepositMaterialsTransactionDTO[];
}
