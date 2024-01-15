import { TypeEcopointEnum } from 'src/shared/enum/type-ecopoint.enum';
import { RequestActionEcopoint } from '../enum/request-action-ecopoint.enum';

export class ResponseRequestEcopointDto {
  id: number;
  cnpjEmpresa: string;
  acao: RequestActionEcopoint;
  tipoEcoponto: TypeEcopointEnum | null;
  ecopontoId: string;
  agendadoPara: Date | null;
  atendidoEm: Date | null;
  lat?: number;
  long?: number;
}
