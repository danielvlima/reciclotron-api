import { ApiProperty } from '@nestjs/swagger';

export class PaginatedNewEcopointsRequestDto {
  @ApiProperty()
  cnpj: string;

  @ApiProperty()
  skip: number;

  @ApiProperty()
  take: number;
}
