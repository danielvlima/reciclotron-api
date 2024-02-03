import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { DiscountCouponService } from '../discount-coupon/discount-coupon.service';
import { UsersService } from '../users/users.service';
import { CouponsPurchasedService } from '../coupons-purchased/coupons-purchased.service';
import { AdminStrategy, AtStrategy, UserStrategy } from 'src/shared/strategies';
import { EcopointsService } from '../ecopoints/ecopoints.service';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    DiscountCouponService,
    EcopointsService,
    UsersService,
    CouponsPurchasedService,
    UserStrategy,
    AdminStrategy,
    AtStrategy,
  ],
})
export class TransactionsModule {}
