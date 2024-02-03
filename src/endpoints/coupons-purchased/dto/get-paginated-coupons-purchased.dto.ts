import { ApiProperty } from '@nestjs/swagger';
import { FilterCouponsPurchasedDto } from './filter.coupons.purchased.dto';
import { OrderByCouponsPurchasedDto } from './order-by-coupons-purchased.dto';

export class GetPaginatedCouponsPurchasedDto {
  @ApiProperty()
  skip: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  filtro: FilterCouponsPurchasedDto;

  @ApiProperty()
  ordem: OrderByCouponsPurchasedDto;
}
