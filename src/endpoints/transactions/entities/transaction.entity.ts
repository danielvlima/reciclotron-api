import { $Enums } from '@prisma/client';

export class Transaction {
  tipo: $Enums.TipoTransacao;
  materiaisDepositados: any[];
  cupom?: { nome: string } | null;
  id: bigint;
  finalizadoEm: Date | null;
  valorTotal: number;
}
