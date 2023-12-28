import { ResponseCouponsPurchasedDto } from './response-coupons-purchased.dto';

export class ResponsePaginatedCouponsPurchasedDto {
  total: number;
  cupons: ResponseCouponsPurchasedDto[];
}
