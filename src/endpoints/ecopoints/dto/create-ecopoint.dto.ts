import { TypeEcopointEnum } from 'src/shared/enum/type-ecopoint.enum';

export class CreateEcopointDto {
  id: string;
  nome: string;
  ativo: boolean | undefined;
  enderecoId: number;
  tipo: TypeEcopointEnum;
}
