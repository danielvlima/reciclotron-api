import { ApiProperty } from '@nestjs/swagger';
import { FilterTransactionsOptionsDto } from './filter-transactions-options.dto';

export class PaginatedTransaction {
  @ApiProperty()
  skip: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  filterOption: FilterTransactionsOptionsDto;
}
