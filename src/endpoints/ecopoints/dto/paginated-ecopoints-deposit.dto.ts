import { ApiProperty } from '@nestjs/swagger';

export class PaginatedEcopointsDepositDto {
  @ApiProperty()
  lat: number;

  @ApiProperty()
  long: number;

  @ApiProperty()
  hasItemForBox: boolean;

  @ApiProperty()
  city?: string;

  @ApiProperty()
  skip: number;

  @ApiProperty()
  take: number;
}
