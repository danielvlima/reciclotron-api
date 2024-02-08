import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
  Patch,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { RequestEcopointsService } from './request-ecopoints.service';
import { CreateRequestEcopointDto } from './dto/create-request-ecopoint.dto';
import { RequestActionEcopoint } from './enum/request-action-ecopoint.enum';
import {
  CancelRequestEcopointDto,
  ResponsePaginatedEcopointsRequestDto,
  UpdateRequestEcopointDto,
} from './dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { toEcopointRequestDTO } from './mappers';
import { ApiTags } from '@nestjs/swagger';
import { ParseDateIsoPipe } from 'src/shared/parsers/ParseDateIsoType';
import { GetCurrentKey, Public } from 'src/shared/decorators';
import { AdminGuard, PartnerGuard } from 'src/shared/guards';

@ApiTags('Ações para Ecopontos')
@Controller('request-ecopoints')
export class RequestEcopointsController {
  constructor(
    private readonly requestEcopointsService: RequestEcopointsService,
  ) {}

  @UseGuards(PartnerGuard)
  @Public()
  @Post('partner/create')
  create(
    @GetCurrentKey() cnpj: string,
    @Body() createRequestEcopointDto: CreateRequestEcopointDto,
  ) {
    if (createRequestEcopointDto.acao === RequestActionEcopoint.ADICIONAR) {
      return this.requestEcopointsService
        .createAddEcopoint(cnpj, createRequestEcopointDto)
        .then((value) => {
          return ResponseFactoryModule.generate(toEcopointRequestDTO(value));
        });
    }
    return this.requestEcopointsService.create(cnpj, createRequestEcopointDto);
  }

  @UseGuards(PartnerGuard)
  @Public()
  @Get('partner/find/new-ecopoints')
  async findPaginatedNewEcopoints(
    @GetCurrentKey() cnpj: string,
    @Query('skip', new ParseIntPipe()) skip: number,
    @Query('take', new ParseIntPipe()) take: number,
  ): Promise<ResponseDto<ResponsePaginatedEcopointsRequestDto>> {
    const total = await this.requestEcopointsService.countNewEcopoints(cnpj);

    if (!total) {
      return ResponseFactoryModule.generate({
        total,
        ecopontos: [],
      });
    }

    const newEcopoints =
      await this.requestEcopointsService.findPaginatedNewEcopoints(
        cnpj,
        skip,
        take,
      );

    return ResponseFactoryModule.generate({
      total,
      ecopontos: newEcopoints.map((el) => toEcopointRequestDTO(el)),
    });
  }

  @UseGuards(AdminGuard)
  @Get('admin/find')
  async findAll(
    @Query('skip', new ParseIntPipe()) skip: number,
    @Query('take', new ParseIntPipe()) take: number,
    @Query('adicionarRealizado', new ParseBoolPipe())
    adicionarRealizado: boolean,
    @Query('dia', ParseDateIsoPipe) dia?: string,
  ) {
    const total = await this.requestEcopointsService.countAllRequests(
      adicionarRealizado,
      dia,
    );

    if (!total) {
      return ResponseFactoryModule.generate({
        total,
        ecopontos: [],
      });
    }

    const requestEcopoints =
      await this.requestEcopointsService.findAllPaginated(
        skip,
        take,
        adicionarRealizado,
        dia,
      );

    return ResponseFactoryModule.generate({
      total,
      ecopontos: requestEcopoints.map((el) => toEcopointRequestDTO(el)),
    });
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('admin/update')
  update(@Body() updateRequestEcopointDto: UpdateRequestEcopointDto) {
    return this.requestEcopointsService
      .update(updateRequestEcopointDto)
      .then(() => {});
  }

  @UseGuards(PartnerGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('partner/cancel')
  cancel(
    @GetCurrentKey() cnpj: string,
    @Body() data: CancelRequestEcopointDto,
  ) {
    return this.requestEcopointsService.cancel(cnpj, data);
  }
}
