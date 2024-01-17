import { Module } from '@nestjs/common';
import { CouponsPurchasedService } from './coupons-purchased.service';
import { CouponsPurchasedController } from './coupons-purchased.controller';

@Module({
  controllers: [CouponsPurchasedController],
  providers: [CouponsPurchasedService],
  exports: [CouponsPurchasedService],
})
export class CouponsPurchasedModule {}
