import { ApiProperty } from '@nestjs/swagger';

export class StatisticsDatesDto {
  @ApiProperty()
  mesInicial: number;

  @ApiProperty()
  anoInicial: number;

  @ApiProperty()
  mesFinal?: number;

  @ApiProperty()
  anoFinal?: number;
}
