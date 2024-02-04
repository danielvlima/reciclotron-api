import { ApiProperty } from '@nestjs/swagger';

export class CancelRequestEcopointDto {
  @ApiProperty()
  ids: number[];
}
