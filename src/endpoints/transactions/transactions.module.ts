import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { DiscountCouponService } from '../discount-coupon/discount-coupon.service';
import { CompareModule } from 'src/shared/modules/compare/compare.module';
import { UsersService } from '../users/users.service';
import { CouponsPurchasedService } from '../coupons-purchased/coupons-purchased.service';

@Module({
  imports: [CompareModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    DiscountCouponService,
    UsersService,
    CouponsPurchasedService,
  ],
})
export class TransactionsModule {}
