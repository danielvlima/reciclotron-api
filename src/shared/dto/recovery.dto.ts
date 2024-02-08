import { ApiProperty } from '@nestjs/swagger';

export class RecoveryDto {
  @ApiProperty()
  key: string;
}
