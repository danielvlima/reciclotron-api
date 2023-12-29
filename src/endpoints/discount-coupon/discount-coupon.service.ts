import { Injectable } from '@nestjs/common';
import { CreateDiscountCouponDto } from './dto/create-discount-coupon.dto';
import { UpdateDiscountCouponDto } from './dto/update-discount-coupon.dto';

@Injectable()
export class DiscountCouponService {
  create(createDiscountCouponDto: CreateDiscountCouponDto) {
    return 'This action adds a new discountCoupon';
  }

  findAll() {
    return `This action returns all discountCoupon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discountCoupon`;
  }

  update(id: number, updateDiscountCouponDto: UpdateDiscountCouponDto) {
    return `This action updates a #${id} discountCoupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} discountCoupon`;
  }
}
