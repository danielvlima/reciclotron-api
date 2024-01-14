import { ApiProperty } from '@nestjs/swagger';

export class GetPaginatedAddressesDTO {
  @ApiProperty()
  skip: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  busca: string;
}
