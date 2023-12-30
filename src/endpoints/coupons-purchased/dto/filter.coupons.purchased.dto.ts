import { ApiProperty } from '@nestjs/swagger';

export class FilterCouponsPurchasedDto {
  @ApiProperty()
  nomeFantasia?: string;
}
