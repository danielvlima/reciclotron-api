import { ApiProperty } from '@nestjs/swagger';

export class StatisticsDatesDto {
  @ApiProperty()
  diaInicial: number;

  @ApiProperty()
  mesInicial: number;

  @ApiProperty()
  anoInicial: number;

  @ApiProperty()
  diaFinal?: number;

  @ApiProperty()
  mesFinal?: number;

  @ApiProperty()
  anoFinal?: number;
}
