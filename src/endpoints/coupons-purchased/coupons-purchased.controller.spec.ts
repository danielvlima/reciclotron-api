import { Test, TestingModule } from '@nestjs/testing';
import { CouponsPurchasedController } from './coupons-purchased.controller';
import { CouponsPurchasedService } from './coupons-purchased.service';

describe('CouponsPurchasedController', () => {
  let controller: CouponsPurchasedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponsPurchasedController],
      providers: [CouponsPurchasedService],
    }).compile();

    controller = module.get<CouponsPurchasedController>(CouponsPurchasedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
