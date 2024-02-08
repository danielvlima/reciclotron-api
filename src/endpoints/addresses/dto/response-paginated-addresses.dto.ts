import { ResponseAddressDto } from 'src/endpoints/addresses/dto/response-address.dto';

export class ResponsePaginatedAddressesDTO {
  total: number;
  addresses: ResponseAddressDto[];
}
