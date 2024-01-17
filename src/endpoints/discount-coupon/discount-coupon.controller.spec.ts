import { Test, TestingModule } from '@nestjs/testing';
import { DiscountCouponController } from './discount-coupon.controller';
import { DiscountCouponService } from './discount-coupon.service';

describe('DiscountCouponController', () => {
  let controller: DiscountCouponController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountCouponController],
      providers: [DiscountCouponService],
    }).compile();

    controller = module.get<DiscountCouponController>(DiscountCouponController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
