import { ApiProperty } from '@nestjs/swagger';
import { FilterOptionsAddressesDTO } from './filter-options-addresses.dto';

export class GetPaginatedAddressesDTO {
  @ApiProperty()
  skip: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  filterOptions: FilterOptionsAddressesDTO;
}
