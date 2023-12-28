import { FilterOptionsPartnerDto } from './filter-options-partner.dto';

export class GetPaginatedPartnerDto {
  skip: number;
  take: number;
  filtro: FilterOptionsPartnerDto;
}
