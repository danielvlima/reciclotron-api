import { ResponsePartnerDto } from './response-partner.dto';

export class ResponsePaginatedPartnerDto {
  total: number;
  empresas: ResponsePartnerDto[];
}
