import { Test, TestingModule } from '@nestjs/testing';
import { CouponsPurchasedService } from './coupons-purchased.service';

describe('CouponsPurchasedService', () => {
  let service: CouponsPurchasedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponsPurchasedService],
    }).compile();

    service = module.get<CouponsPurchasedService>(CouponsPurchasedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
