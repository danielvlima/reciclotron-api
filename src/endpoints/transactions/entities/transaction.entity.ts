import { $Enums } from '@prisma/client';
import { MateriaisDepositados } from './materiais-depositados.entity';

export class Transaction {
  tipo: $Enums.TipoTransacao;
  materiaisDepositados: MateriaisDepositados[];
  cupom?: { nome: string } | null;
  id: bigint;
  titulo: string;
  finalizadoEm: Date | null;
  valorTotal: number;
  usuarioCPF: string;
  ecopontoId?: string | null;
}
