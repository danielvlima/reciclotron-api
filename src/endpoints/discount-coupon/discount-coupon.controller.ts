import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
} from '@nestjs/common';
import { DiscountCouponService } from './discount-coupon.service';
import { CreateDiscountCouponDto } from './dto/create-discount-coupon.dto';
import { UpdateDiscountCouponDto } from './dto/update-discount-coupon.dto';
import {
  PaginatedPartnerCouponsDto,
  ResponseDiscountCouponDto,
  ResponsePaginatedDiscountCouponDto,
  SearchDiscountCouponDto,
} from './dto';
import { toCouponsDescDTO } from './mappers';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cupons de Desconto')
@Controller('discount-coupon')
export class DiscountCouponController {
  constructor(private readonly discountCouponService: DiscountCouponService) {}

  @Post()
  create(@Body() createDiscountCouponDto: CreateDiscountCouponDto) {
    return this.discountCouponService
      .create(createDiscountCouponDto)
      .then((value) => {
        return ResponseFactoryModule.generate<ResponseDiscountCouponDto>(
          toCouponsDescDTO(value),
        );
      });
  }

  @HttpCode(200)
  @Post('findAllPartner')
  findAllPartner(@Body() data: PaginatedPartnerCouponsDto) {
    return this.discountCouponService.countPartner(data).then((total) => {
      return this.discountCouponService
        .findPaginatedForPartner(data)
        .then((coupons) => {
          return ResponseFactoryModule.generate<ResponsePaginatedDiscountCouponDto>(
            {
              total,
              cupons: coupons.map((el) => toCouponsDescDTO(el)),
            },
          );
        });
    });
  }

  @HttpCode(200)
  @Post('userFindBySearch')
  userFindBySearch(@Body() data: SearchDiscountCouponDto) {
    return this.discountCouponService.search(data.value).then((value) => {
      return ResponseFactoryModule.generate<ResponseDiscountCouponDto[]>(
        value.map((el) => toCouponsDescDTO(el)),
      );
    });
  }

  @Get('userFindByRamo')
  userFindByRamo() {
    return this.discountCouponService.findRamos().then(async (tiposDeRamos) => {
      const coupons = new Map<string, ResponseDiscountCouponDto[]>();
      for (const tipoDeRamo of tiposDeRamos) {
        const list = await this.discountCouponService
          .findByRamos(tipoDeRamo.ramo, 10)
          .then((response) => {
            return response.map((el) => toCouponsDescDTO(el, el.empresa?.ramo));
          });
        coupons.set(tipoDeRamo.ramo, list);
      }

      return ResponseFactoryModule.generate(Object.fromEntries(coupons));
    });
  }

  @Get('userFindAll')
  userFindAll(
    @Query('skip', new ParseIntPipe()) skip: number,
    @Query('take', new ParseIntPipe()) take: number,
  ) {
    return this.discountCouponService.findAll(skip, take).then((value) => {
      return ResponseFactoryModule.generate<ResponseDiscountCouponDto[]>(
        value.map((el) => toCouponsDescDTO(el)),
      );
    });
  }

  @HttpCode(204)
  @Patch()
  update(@Body() updateDiscountCouponDto: UpdateDiscountCouponDto) {
    return this.discountCouponService
      .update(updateDiscountCouponDto)
      .then((value) => {
        return ResponseFactoryModule.generate<ResponseDiscountCouponDto>(
          toCouponsDescDTO(value),
        );
      });
  }

  @HttpCode(204)
  @Delete('/:cnpj/:id')
  remove(
    @Param('cnpj') cnpj: string,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.discountCouponService.remove(cnpj, id);
  }
}
