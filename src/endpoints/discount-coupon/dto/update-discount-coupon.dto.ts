import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscountCouponDto } from './create-discount-coupon.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDiscountCouponDto extends PartialType(
  CreateDiscountCouponDto,
) {
  @ApiProperty()
  id: number;
}
