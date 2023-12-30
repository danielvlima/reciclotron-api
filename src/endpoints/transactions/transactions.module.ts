import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { DiscountCouponService } from '../discount-coupon/discount-coupon.service';

@Module({
  imports: [DiscountCouponService],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
