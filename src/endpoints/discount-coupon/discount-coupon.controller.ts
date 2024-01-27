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
  UseGuards,
  HttpStatus,
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
import { GetCurrentKey, Public } from 'src/shared/decorators';
import { PartnerGuard, UserGuard } from 'src/shared/guards';

@ApiTags('Cupons de Desconto')
@Controller('discount-coupon')
export class DiscountCouponController {
  constructor(private readonly discountCouponService: DiscountCouponService) {}

  @UseGuards(PartnerGuard)
  @Public()
  @Post('create')
  create(@Body() createDiscountCouponDto: CreateDiscountCouponDto) {
    return this.discountCouponService
      .create(createDiscountCouponDto)
      .then((value) => {
        return ResponseFactoryModule.generate<ResponseDiscountCouponDto>(
          toCouponsDescDTO(value),
        );
      });
  }

  @UseGuards(PartnerGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('partner/find')
  async findAllPartner(
    @GetCurrentKey() cnpj: string,
    @Body() data: PaginatedPartnerCouponsDto,
  ) {
    const total = await this.discountCouponService.countPartner(cnpj, data);

    if (!total) {
      return ResponseFactoryModule.generate<ResponsePaginatedDiscountCouponDto>(
        {
          total,
          cupons: [],
        },
      );
    }

    const coupons = await this.discountCouponService.findPaginatedForPartner(
      cnpj,
      data,
    );
    return ResponseFactoryModule.generate<ResponsePaginatedDiscountCouponDto>({
      total,
      cupons: coupons.map((el) => toCouponsDescDTO(el)),
    });
  }

  @UseGuards(UserGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('user/find/search')
  userFindBySearch(@Body() data: SearchDiscountCouponDto) {
    return this.discountCouponService.search(data.value).then((value) => {
      return ResponseFactoryModule.generate<ResponseDiscountCouponDto[]>(
        value.map((el) => toCouponsDescDTO(el)),
      );
    });
  }

  @UseGuards(UserGuard)
  @Public()
  @Get('user/find/ramo')
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

  @UseGuards(UserGuard)
  @Get('user/find/all')
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

  @UseGuards(PartnerGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('partner/update')
  update(
    @GetCurrentKey() cnpj: string,
    @Body() updateDiscountCouponDto: UpdateDiscountCouponDto,
  ) {
    return this.discountCouponService
      .update(cnpj, updateDiscountCouponDto)
      .then(() => {});
  }

  @UseGuards(PartnerGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('partner/delete/:id')
  remove(
    @GetCurrentKey() cnpj: string,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.discountCouponService.remove(cnpj, id).then(() => {});
  }
}
