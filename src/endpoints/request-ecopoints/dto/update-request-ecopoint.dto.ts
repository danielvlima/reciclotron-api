import { ApiProperty } from '@nestjs/swagger';

export class UpdateRequestEcopointDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  atendidoEm?: Date;

  @ApiProperty()
  agendadoPara?: Date;
}
