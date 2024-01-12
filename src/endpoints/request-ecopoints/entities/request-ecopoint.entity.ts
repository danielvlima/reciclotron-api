import { $Enums } from '@prisma/client';
import { Partner } from 'src/endpoints/partner/entities/partner.entity';

export class RequestEcopoint {
  id: bigint;
  acao: $Enums.TipoSolicitacaoEcoponto;
  cnpjEmpresa: string;
  tipoEcoponto: $Enums.TipoEcoponto | null;
  ecopontoId: string | null;
  criadoEm: Date;
  atendidoEm: Date | null;
  agendadoPara: Date | null;
  empresa?: Partner;
}
