import { ApiProperty } from '@nestjs/swagger';

export class SearchDiscountCouponDto {
  @ApiProperty()
  value: string;
}
