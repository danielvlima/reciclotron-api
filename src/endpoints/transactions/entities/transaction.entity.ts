import { $Enums, MateriaisDepositados } from '@prisma/client';

export class Transaction {
  tipo: $Enums.TipoTransacao;
  materiaisDepositados: MateriaisDepositados[];
  cupom?: { nome: string } | null;
  id: bigint;
  finalizadoEm: Date | null;
  valorTotal: number;
  usuarioCPF: string;
  ecopontoId?: string | null;
}
