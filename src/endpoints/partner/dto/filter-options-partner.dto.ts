import { TypePartnerEnum } from '../enum/type-partner.enum';

export class FilterOptionsPartnerDto {
  nome?: string;
  ramo?: string;
  tipoEmpresa?: TypePartnerEnum;
  ativo?: boolean;
}
