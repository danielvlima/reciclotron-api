import { Controller, Post, Body, Param, HttpCode } from '@nestjs/common';
import { CouponsPurchasedService } from './coupons-purchased.service';
import { CreateCouponsPurchasedDto } from './dto/create-coupons-purchased.dto';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import {
  GetPaginatedCouponsPurchasedDto,
  ResponsePaginatedCouponsPurchasedDto,
} from './dto';
import { toCouponsPurchasedDTO } from './mappers';

@Controller('couponsPurchased')
export class CouponsPurchasedController {
  constructor(
    private readonly couponsPurchasedService: CouponsPurchasedService,
  ) {}

  @Post('create')
  create(@Body() createCouponsPurchasedDto: CreateCouponsPurchasedDto) {
    return this.couponsPurchasedService.create(createCouponsPurchasedDto);
  }

  @HttpCode(200)
  @Post('filters/:cpf')
  findAll(@Param('cpf') cpf: string): Promise<ResponseDto<string[]>> {
    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);
    return this.couponsPurchasedService
      .findFilters(cpf, dateNow)
      .then((val) => {
        return ResponseFactoryModule.generate(val);
      });
  }

  @HttpCode(200)
  @Post()
  findPaginated(
    @Body() data: GetPaginatedCouponsPurchasedDto,
  ): Promise<ResponseDto<ResponsePaginatedCouponsPurchasedDto>> {
    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);
    return this.couponsPurchasedService.count(data, dateNow).then((total) => {
      return this.couponsPurchasedService
        .findPaginated(data, dateNow)
        .then((coupons) => {
          return ResponseFactoryModule.generate<ResponsePaginatedCouponsPurchasedDto>(
            {
              total,
              cupons: coupons.map((el) => toCouponsPurchasedDTO(el)),
            },
          );
        });
    });
  }
}
