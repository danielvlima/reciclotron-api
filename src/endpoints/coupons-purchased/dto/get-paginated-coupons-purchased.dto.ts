import { FilterCouponsPurchasedDto } from './filter.coupons.purchased.dto';
import { OrderByCouponsPurchasedDto } from './order-by-coupons-purchased.dto';

export class GetPaginatedCouponsPurchasedDto {
  usuarioCPF: string;
  skip: number;
  take: number;
  filtro: FilterCouponsPurchasedDto;
  ordem: OrderByCouponsPurchasedDto;
}
