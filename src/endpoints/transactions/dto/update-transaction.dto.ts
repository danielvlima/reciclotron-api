import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  valorTotal?: number;
}
