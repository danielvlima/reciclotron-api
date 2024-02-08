import { ApiProperty } from '@nestjs/swagger';
import { FilterOptionsCouponsDto } from './filter-options-coupons.dto';

export class PaginatedPartnerCouponsDto {
  @ApiProperty()
  skip: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  filterOptions: FilterOptionsCouponsDto;
}
