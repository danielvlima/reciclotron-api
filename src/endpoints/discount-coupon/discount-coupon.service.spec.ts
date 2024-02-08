import { Test, TestingModule } from '@nestjs/testing';
import { DiscountCouponService } from './discount-coupon.service';

describe('DiscountCouponService', () => {
  let service: DiscountCouponService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountCouponService],
    }).compile();

    service = module.get<DiscountCouponService>(DiscountCouponService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
