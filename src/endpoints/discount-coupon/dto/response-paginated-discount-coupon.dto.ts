import { ResponseDiscountCouponDto } from './response-discount-coupon.dto';

export class ResponsePaginatedDiscountCouponDto {
  total: number;
  cupons: ResponseDiscountCouponDto[];
}
