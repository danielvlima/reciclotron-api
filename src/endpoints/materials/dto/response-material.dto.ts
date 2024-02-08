import { TypeEcopontoAccepted } from '../enum/type-ecoponto-accepted.enum';

export class ResponseMaterialDto {
  id: number;
  nome: string;
  valor: number;
  logo: string | null;
  ehAceitoTipoEcoponto: TypeEcopontoAccepted;
}
