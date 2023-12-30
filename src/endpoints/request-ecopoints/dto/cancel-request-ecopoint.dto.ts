import { ApiProperty } from '@nestjs/swagger';

export class CancelRequestEcopointDto {
  @ApiProperty()
  cnpj: string;

  @ApiProperty()
  ids: number[];
}
