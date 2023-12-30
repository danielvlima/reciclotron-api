import { FilterTransactionsOptionsDto } from './filter-transactions-options.dto';

export class PaginatedTransaction {
  usuarioCPF: string;
  skip: number;
  take: number;
  filterOption: FilterTransactionsOptionsDto;
}
