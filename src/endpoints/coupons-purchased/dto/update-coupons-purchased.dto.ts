import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponsPurchasedDto } from './create-coupons-purchased.dto';

export class UpdateCouponsPurchasedDto extends PartialType(CreateCouponsPurchasedDto) {}
