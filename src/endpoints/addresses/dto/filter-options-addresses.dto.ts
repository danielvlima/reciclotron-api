import { ApiProperty } from '@nestjs/swagger';

export class FilterOptionsAddressesDTO {
  @ApiProperty()
  busca: string;
}
