import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';

import { ApiTags } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { GetPaginatedAddressesDTO, ResponsePaginatedAddressesDTO } from './dto';
import { toAddressDTO } from './mappers';

@ApiTags('Endereços')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @HttpCode(200)
  @Post()
  findPaginated(
    @Body() data: GetPaginatedAddressesDTO,
  ): Promise<ResponseDto<ResponsePaginatedAddressesDTO>> {
    return this.addressesService.count(data).then((total) => {
      return this.addressesService.findPaginated(data).then((addresses) => {
        return ResponseFactoryModule.generate<ResponsePaginatedAddressesDTO>({
          total,
          addresses: addresses.map((el) => toAddressDTO(el)),
        });
      });
    });
  }
}
