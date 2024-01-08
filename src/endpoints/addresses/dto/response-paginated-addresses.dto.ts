import { ResponseAddressDto } from 'src/shared/dto/response-address.dto';

export class ResponsePaginatedAddressesDTO {
  total: number;
  addresses: ResponseAddressDto[];
}
