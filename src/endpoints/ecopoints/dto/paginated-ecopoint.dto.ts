import { ApiProperty } from '@nestjs/swagger';
import { TypeEcopointEnum } from 'src/shared/enum/type-ecopoint.enum';

export class PaginatedEcopointDto {
  @ApiProperty()
  skip: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  busca: string;

  @ApiProperty()
  tipo?: TypeEcopointEnum;

  @ApiProperty()
  enderecoId?: number;

  @ApiProperty()
  ativo?: boolean;
}
