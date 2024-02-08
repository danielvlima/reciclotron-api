import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';

import { ApiTags } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { GetPaginatedAddressesDTO, ResponsePaginatedAddressesDTO } from './dto';
import { toAddressDTO } from './mappers';
import { Public } from 'src/shared/decorators';
import { AdminGuard } from 'src/shared/guards';

@ApiTags('Endereços')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('admin/find')
  async findPaginated(
    @Body() data: GetPaginatedAddressesDTO,
  ): Promise<ResponseDto<ResponsePaginatedAddressesDTO>> {
    const total = await this.addressesService.count(data);

    if (!total) {
      return ResponseFactoryModule.generate<ResponsePaginatedAddressesDTO>({
        total,
        addresses: [],
      });
    }

    const addresses = await this.addressesService.findPaginated(data);
    return ResponseFactoryModule.generate<ResponsePaginatedAddressesDTO>({
      total,
      addresses: addresses.map((el) => toAddressDTO(el)),
    });
  }
}
