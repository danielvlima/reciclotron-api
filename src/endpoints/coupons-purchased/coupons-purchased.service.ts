import { Injectable } from '@nestjs/common';
import { CreateCouponsPurchasedDto } from './dto/create-coupons-purchased.dto';
import { UpdateCouponsPurchasedDto } from './dto/update-coupons-purchased.dto';

@Injectable()
export class CouponsPurchasedService {
  create(createCouponsPurchasedDto: CreateCouponsPurchasedDto) {
    return 'This action adds a new couponsPurchased';
  }

  findAll() {
    return `This action returns all couponsPurchased`;
  }

  findOne(id: number) {
    return `This action returns a #${id} couponsPurchased`;
  }

  update(id: number, updateCouponsPurchasedDto: UpdateCouponsPurchasedDto) {
    return `This action updates a #${id} couponsPurchased`;
  }

  remove(id: number) {
    return `This action removes a #${id} couponsPurchased`;
  }
}
