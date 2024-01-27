import { Module } from '@nestjs/common';
import { DiscountCouponService } from './discount-coupon.service';
import { DiscountCouponController } from './discount-coupon.controller';
import { PartnerStrategy, UserStrategy } from 'src/shared/strategies';

@Module({
  controllers: [DiscountCouponController],
  providers: [DiscountCouponService, UserStrategy, PartnerStrategy],
  exports: [DiscountCouponService],
})
export class DiscountCouponModule {}
