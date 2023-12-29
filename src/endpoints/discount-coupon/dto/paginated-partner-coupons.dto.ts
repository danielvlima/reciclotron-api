import { FilterOptionsCouponsDto } from './filter-options-coupons.dto';

export class PaginatedPartnerCouponsDto {
  cnpj: string;
  skip: number;
  take: number;
  filterOptions: FilterOptionsCouponsDto;
}
