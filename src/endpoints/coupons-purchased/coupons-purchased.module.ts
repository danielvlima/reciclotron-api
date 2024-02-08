import { Module } from '@nestjs/common';
import { CouponsPurchasedService } from './coupons-purchased.service';
import { CouponsPurchasedController } from './coupons-purchased.controller';
import { UserStrategy } from 'src/shared/strategies';

@Module({
  controllers: [CouponsPurchasedController],
  providers: [CouponsPurchasedService, UserStrategy],
  exports: [CouponsPurchasedService],
})
export class CouponsPurchasedModule {}
