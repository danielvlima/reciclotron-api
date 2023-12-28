import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CouponsPurchasedService } from './coupons-purchased.service';
import { CreateCouponsPurchasedDto } from './dto/create-coupons-purchased.dto';
import { UpdateCouponsPurchasedDto } from './dto/update-coupons-purchased.dto';

@Controller('coupons-purchased')
export class CouponsPurchasedController {
  constructor(private readonly couponsPurchasedService: CouponsPurchasedService) {}

  @Post()
  create(@Body() createCouponsPurchasedDto: CreateCouponsPurchasedDto) {
    return this.couponsPurchasedService.create(createCouponsPurchasedDto);
  }

  @Get()
  findAll() {
    return this.couponsPurchasedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponsPurchasedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponsPurchasedDto: UpdateCouponsPurchasedDto) {
    return this.couponsPurchasedService.update(+id, updateCouponsPurchasedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponsPurchasedService.remove(+id);
  }
}
