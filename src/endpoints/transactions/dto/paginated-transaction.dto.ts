import { ApiProperty } from '@nestjs/swagger';
import { FilterTransactionsOptionsDto } from './filter-transactions-options.dto';

export class PaginatedTransaction {
  @ApiProperty()
  usuarioCPF: string;

  @ApiProperty()
  skip: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  filterOption: FilterTransactionsOptionsDto;
}
