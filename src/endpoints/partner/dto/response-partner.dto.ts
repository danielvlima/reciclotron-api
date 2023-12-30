import { TypePartnerEnum } from '../enum/type-partner.enum';
import { ResponseAddressDto } from '../../../shared/dto/response-address.dto';

export class ResponsePartnerDto {
  cnpj: string;
  logo: string | null;
  email: string;
  telefone: string;
  nomeFantasia: string;
  razaoSocial: string;
  ramo: string;
  ativo: boolean | undefined;
  tipoEmpresa: TypePartnerEnum;
  enderecolojaOnline: string | null;
  endereco: ResponseAddressDto | null;
}
