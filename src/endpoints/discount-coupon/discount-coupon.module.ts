import { Module } from '@nestjs/common';
import { DiscountCouponService } from './discount-coupon.service';
import { DiscountCouponController } from './discount-coupon.controller';

@Module({
  controllers: [DiscountCouponController],
  providers: [DiscountCouponService],
  exports: [DiscountCouponService],
})
export class DiscountCouponModule {}
