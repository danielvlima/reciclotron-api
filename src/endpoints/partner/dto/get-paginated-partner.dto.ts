import { ApiProperty } from '@nestjs/swagger';
import { FilterOptionsPartnerDto } from './filter-options-partner.dto';

export class GetPaginatedPartnerDto {
  @ApiProperty()
  skip: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  filtro: FilterOptionsPartnerDto;
}
