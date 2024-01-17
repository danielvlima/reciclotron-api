import { ApiProperty } from '@nestjs/swagger';

export class CheckCodeDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  codigo: string;
}
