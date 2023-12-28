import { TypeEcopontoAccepted } from '../enum/type-ecoponto-accepted.enum';

export class CreateMaterialDto {
  nome: string;
  valor: number;
  ehAceitoTipoEcoponto: TypeEcopontoAccepted;
}
