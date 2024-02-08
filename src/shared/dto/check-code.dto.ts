import { ApiProperty } from '@nestjs/swagger';

export class CheckCodeDto {
  @ApiProperty()
  codigo: string;
}
