import { ResponseAddressDto } from 'src/endpoints/partner/dto';
import { TypeEcopointEnum } from 'src/shared/enum/type-ecopoint.enum';

export class ResponseEcopointDto {
  id: string;
  nome: string;
  ativo: boolean | undefined;
  endereco: ResponseAddressDto;
  tipo: TypeEcopointEnum;
  distancia?: number;
}
