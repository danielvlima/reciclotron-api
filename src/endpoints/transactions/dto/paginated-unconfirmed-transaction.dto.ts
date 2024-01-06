import { ApiProperty } from '@nestjs/swagger';

export class PaginatedUnconfirmedTransaction {
  @ApiProperty()
  skip: number;

  @ApiProperty()
  take: number;
}
