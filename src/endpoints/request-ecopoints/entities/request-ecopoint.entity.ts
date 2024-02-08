import { $Enums } from '@prisma/client';
import { Address } from 'src/endpoints/addresses/entities/address.entity';

export class RequestEcopoint {
  id: bigint;
  acao: $Enums.TipoSolicitacaoEcoponto;
  cnpjEmpresa: string;
  tipoEcoponto: $Enums.TipoEcoponto | null;
  ecopontoId: string | null;
  criadoEm: Date;
  atendidoEm: Date | null;
  agendadoPara: Date | null;
  empresa?: {
    endereco?: Address | null;
  };
}
