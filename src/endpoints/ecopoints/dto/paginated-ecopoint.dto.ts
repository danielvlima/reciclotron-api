export class PaginatedEcopointDto {
  skip: number;
  take: number;
  busca: string;
  enderecoId?: number;
  ativo?: boolean;
}
