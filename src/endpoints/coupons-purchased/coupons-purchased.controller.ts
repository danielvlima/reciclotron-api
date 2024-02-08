import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CouponsPurchasedService } from './coupons-purchased.service';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import {
  GetPaginatedCouponsPurchasedDto,
  ResponsePaginatedCouponsPurchasedDto,
} from './dto';
import { toCouponsPurchasedDTO } from './mappers';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentKey, Public } from 'src/shared/decorators';
import { UserGuard } from 'src/shared/guards';

@ApiTags('Cupons comprados pelo Usuário')
@Controller('couponsPurchased')
export class CouponsPurchasedController {
  constructor(
    private readonly couponsPurchasedService: CouponsPurchasedService,
  ) {}

  @UseGuards(UserGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('filters')
  findAll(@GetCurrentKey() cpf: string): Promise<ResponseDto<string[]>> {
    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);
    return this.couponsPurchasedService
      .findFilters(cpf, dateNow)
      .then((val) => {
        return ResponseFactoryModule.generate(val);
      });
  }

  @UseGuards(UserGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('get')
  async findPaginated(
    @GetCurrentKey() cpf: string,
    @Body() data: GetPaginatedCouponsPurchasedDto,
  ): Promise<ResponseDto<ResponsePaginatedCouponsPurchasedDto>> {
    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);
    const total = await this.couponsPurchasedService.count(cpf, data, dateNow);
    if (!total) {
      return ResponseFactoryModule.generate<ResponsePaginatedCouponsPurchasedDto>(
        {
          total,
          cupons: [],
        },
      );
    }
    const coupons = await this.couponsPurchasedService.findPaginated(
      cpf,
      data,
      dateNow,
    );
    return ResponseFactoryModule.generate<ResponsePaginatedCouponsPurchasedDto>(
      {
        total,
        cupons: coupons.map((el) => toCouponsPurchasedDTO(el)),
      },
    );
  }
}
