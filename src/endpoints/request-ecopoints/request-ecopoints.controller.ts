import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { RequestEcopointsService } from './request-ecopoints.service';
import { CreateRequestEcopointDto } from './dto/create-request-ecopoint.dto';
import { RequestActionEcopoint } from './enum/request-action-ecopoint.enum';
import {
  CancelRequestEcopointDto,
  PaginatedNewEcopointsRequestDto,
  ResponsePaginatedEcopointsRequestDto,
} from './dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { toEcopointRequestDTO } from './mappers';
import { ApiTags } from '@nestjs/swagger';
import { ParseDateIsoPipe } from 'src/shared/parsers/ParseDateIsoType';

@ApiTags('Ações para Ecopontos')
@Controller('request-ecopoints')
export class RequestEcopointsController {
  constructor(
    private readonly requestEcopointsService: RequestEcopointsService,
  ) {}

  @HttpCode(204)
  @Post('create')
  create(@Body() createRequestEcopointDto: CreateRequestEcopointDto) {
    if (createRequestEcopointDto.acao === RequestActionEcopoint.ADICIONAR) {
      return this.requestEcopointsService
        .createAddEcopoint(createRequestEcopointDto)
        .then((value) => {
          return ResponseFactoryModule.generate(toEcopointRequestDTO(value));
        });
    }
    return this.requestEcopointsService.create(createRequestEcopointDto);
  }

  @HttpCode(200)
  @Post('findAllRequestNewEcopoints')
  findPaginatedNewEcopoints(
    @Body() data: PaginatedNewEcopointsRequestDto,
  ): Promise<ResponseDto<ResponsePaginatedEcopointsRequestDto>> {
    return this.requestEcopointsService
      .countNewEcopoints(data.cnpj)
      .then((total) => {
        return this.requestEcopointsService
          .findPaginatedNewEcopoints(data)
          .then((newEcopoints) => {
            return ResponseFactoryModule.generate({
              total,
              ecopontos: newEcopoints.map((el) => toEcopointRequestDTO(el)),
            });
          });
      });
  }

  @Get('findAllRequest')
  findAll(
    @Query('skip', new ParseIntPipe()) skip: number,
    @Query('take', new ParseIntPipe()) take: number,
    @Query('adicionarRealizado', new ParseBoolPipe())
    adicionarRealizado: boolean,
    @Query('dia', ParseDateIsoPipe) dia?: string,
  ) {
    return this.requestEcopointsService
      .countAllRequests(adicionarRealizado, dia)
      .then((total) => {
        return this.requestEcopointsService
          .findAllPaginated(skip, take, adicionarRealizado, dia)
          .then((requestEcopoints) => {
            return ResponseFactoryModule.generate({
              total,
              ecopontos: requestEcopoints.map((el) => toEcopointRequestDTO(el)),
            });
          });
      });
  }

  @HttpCode(204)
  @Post('cancel')
  cancel(@Body() data: CancelRequestEcopointDto) {
    return this.requestEcopointsService.cancel(data);
  }
}
