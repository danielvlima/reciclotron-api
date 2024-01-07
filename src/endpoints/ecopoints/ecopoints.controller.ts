import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { EcopointsService } from './ecopoints.service';
import { CreateEcopointDto } from './dto/create-ecopoint.dto';
import { UpdateEcopointDto } from './dto/update-ecopoint.dto';
import {
  PaginatedEcopointDto,
  PaginatedEcopointsDepositDto,
  ResponseEcopointDto,
  ResponsePaginatedEcopointsDto,
} from './dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import { toEcopontoDTO, toEcopontoDTOFromQuery } from './mappers';
import { RequestEcopointsService } from '../request-ecopoints/request-ecopoints.service';
import { toEcopointRequestDTO } from '../request-ecopoints/mappers';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Ecopontos')
@Controller('ecopoints')
export class EcopointsController {
  constructor(
    private readonly ecopointsService: EcopointsService,
    private readonly requestEcopointsService: RequestEcopointsService,
  ) {}

  @Post()
  create(@Body() createEcopointDto: CreateEcopointDto) {
    return this.ecopointsService.create(createEcopointDto).then((value) => {
      return ResponseFactoryModule.generate<ResponseEcopointDto>(
        toEcopontoDTO(value),
      );
    });
  }

  @HttpCode(200)
  @Post('findPaginated')
  findPaginated(@Body() data: PaginatedEcopointDto) {
    return this.ecopointsService
      .count(data.busca, data.enderecoId, data.ativo)
      .then((total) => {
        return this.ecopointsService
          .findPaginated(data)
          .then(async (ecopoints) => {
            if (data.enderecoId) {
              const list = ecopoints.map((el) => toEcopontoDTO(el));
              for (let i = 0; i < list.length; i++) {
                const action =
                  await this.requestEcopointsService.findOneRequest(list[i].id);
                list[i].actionrequest = action
                  ? toEcopointRequestDTO(action)
                  : null;
              }
              return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>(
                {
                  total,
                  ecopontos: list,
                },
              );
            }
            return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>(
              {
                total,
                ecopontos: ecopoints.map((el) => toEcopontoDTO(el)),
              },
            );
          });
      });
  }

  @HttpCode(200)
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

  @HttpCode(204)
  @Patch()
  update(@Body() updateEcopointDto: UpdateEcopointDto) {
    return this.ecopointsService.update(updateEcopointDto).then((value) => {
      return ResponseFactoryModule.generate<ResponseEcopointDto>(
        toEcopontoDTO(value),
      );
    });
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ecopointsService.remove(id);
  }
}
