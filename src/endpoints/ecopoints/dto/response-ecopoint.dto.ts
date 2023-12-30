import { ResponseAddressDto } from 'src/endpoints/partner/dto';
import { ResponseRequestEcopointDto } from 'src/endpoints/request-ecopoints/dto';
import { TypeEcopointEnum } from 'src/shared/enum/type-ecopoint.enum';

export class ResponseEcopointDto {
  id: string;
  nome: string;
  ativo: boolean | undefined;
  endereco: ResponseAddressDto;
  tipo: TypeEcopointEnum;
  distancia?: number;
  actionrequest?: ResponseRequestEcopointDto | null;
}
