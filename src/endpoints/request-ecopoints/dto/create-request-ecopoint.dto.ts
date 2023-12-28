import { TypeEcopointEnum } from 'src/shared/enum/type-ecopoint.enum';
import { RequestActionEcopoint } from '../enum/request-action-ecopoint.enum';

export class CreateRequestEcopointDto {
  cnpj: string;
  acao: RequestActionEcopoint;
  tipoEcoponto?: TypeEcopointEnum;
  ecopontoIds: string[];
}
