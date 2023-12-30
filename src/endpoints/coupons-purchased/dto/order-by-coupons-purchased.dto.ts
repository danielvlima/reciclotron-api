import { ApiProperty } from '@nestjs/swagger';

export class OrderByCouponsPurchasedDto {
  @ApiProperty()
  opcao: number;
}
