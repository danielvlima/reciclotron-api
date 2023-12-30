import { ApiProperty } from '@nestjs/swagger';

export class PaginatedEcopointDto {
  @ApiProperty()
  skip: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  busca: string;

  @ApiProperty()
  enderecoId?: number;

  @ApiProperty()
  ativo?: boolean;
}
