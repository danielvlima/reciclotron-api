import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EcopointsService } from './ecopoints.service';
import { CreateEcopointDto } from './dto/create-ecopoint.dto';
import { UpdateEcopointDto } from './dto/update-ecopoint.dto';
import {
  PaginatedEcopointDto,
  PaginatedEcopointsDepositDto,
  ResponsePaginatedEcopointsDto,
} from './dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import { toEcopontoDTO, toEcopontoDTOFromQuery } from './mappers';

@Controller('ecopoints')
export class EcopointsController {
  constructor(private readonly ecopointsService: EcopointsService) {}

  @Post()
  create(@Body() createEcopointDto: CreateEcopointDto) {
    return this.ecopointsService.create(createEcopointDto);
  }

  @Post('findPaginated')
  findPaginated(@Body() data: PaginatedEcopointDto) {
    return this.ecopointsService
      .count(data.busca, data.enderecoId, data.ativo)
      .then((total) => {
        return this.ecopointsService.findPaginated(data).then((ecopoints) => {
          return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
            total,
            ecopontos: ecopoints.map((el) => toEcopontoDTO(el)),
          });
        });
      });
  }

  @Post('findForDeposit')
  findForDeposit(@Body() data: PaginatedEcopointsDepositDto) {
    return this.ecopointsService
      .countEcopointsForDeposit(data.hasItemForBox, data.city)
      .then((total) => {
        return this.ecopointsService
          .findPaginatedEcopointsForDeposit(data)
          .then((ecopoints) => {
            return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>(
              {
                total,
                ecopontos: ecopoints.map((el) => toEcopontoDTOFromQuery(el)),
              },
            );
          });
      });
  }

  @Patch()
  update(@Body() updateEcopointDto: UpdateEcopointDto) {
    return this.ecopointsService.update(updateEcopointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ecopointsService.remove(id);
  }
}
