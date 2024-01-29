import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  HttpStatus,
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
import { Public } from 'src/shared/decorators';
import { AdminGuard, PartnerGuard, UserGuard } from 'src/shared/guards';

@ApiTags('Ecopontos')
@Controller('ecopoints')
export class EcopointsController {
  constructor(
    private readonly ecopointsService: EcopointsService,
    private readonly requestEcopointsService: RequestEcopointsService,
  ) {}

  @UseGuards(AdminGuard)
  @Public()
  @Post('admin/create')
  create(@Body() createEcopointDto: CreateEcopointDto) {
    return this.ecopointsService.create(createEcopointDto).then((value) => {
      return ResponseFactoryModule.generate<ResponseEcopointDto>(
        toEcopontoDTO(value),
      );
    });
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('admin/find')
  async findPaginated(@Body() data: PaginatedEcopointDto) {
    const total = await this.ecopointsService.count(
      data.busca,
      data.enderecoId,
      data.ativo,
      data.tipo,
    );

    if (!total) {
      return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
        total,
        ecopontos: [],
      });
    }

    const ecopoints = await this.ecopointsService.findPaginated(data);

    if (data.enderecoId) {
      const list = ecopoints.map((el) => toEcopontoDTO(el));
      for (let i = 0; i < list.length; i++) {
        const action = await this.requestEcopointsService.findOneRequest(
          list[i].id,
        );
        list[i].actionrequest = action ? toEcopointRequestDTO(action) : null;
      }
      return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
        total,
        ecopontos: list,
      });
    }
    return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
      total,
      ecopontos: ecopoints.map((el) => toEcopontoDTO(el)),
    });
  }

  @UseGuards(PartnerGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('partner/find')
  async findPaginatedPartner(@Body() data: PaginatedEcopointDto) {
    const total = await this.ecopointsService.count(
      data.busca,
      data.enderecoId,
      data.ativo,
      data.tipo,
    );

    if (!total) {
      return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
        total,
        ecopontos: [],
      });
    }

    const ecopoints = await this.ecopointsService.findPaginated(data);

    if (data.enderecoId) {
      const list = ecopoints.map((el) => toEcopontoDTO(el));
      for (let i = 0; i < list.length; i++) {
        const action = await this.requestEcopointsService.findOneRequest(
          list[i].id,
        );
        list[i].actionrequest = action ? toEcopointRequestDTO(action) : null;
      }
      return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
        total,
        ecopontos: list,
      });
    }
    return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
      total,
      ecopontos: ecopoints.map((el) => toEcopontoDTO(el)),
    });
  }

  @UseGuards(UserGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('user/find')
  async findForDeposit(@Body() data: PaginatedEcopointsDepositDto) {
    const total = await this.ecopointsService.countEcopointsForDeposit(
      data.hasItemForBox,
      data.city,
    );

    if (!total) {
      return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
        total,
        ecopontos: [],
      });
    }
    const ecopoints =
      await this.ecopointsService.findPaginatedEcopointsForDeposit(data);

    return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
      total,
      ecopontos: ecopoints.map((el) => toEcopontoDTOFromQuery(el)),
    });
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('admin/update')
  update(@Body() updateEcopointDto: UpdateEcopointDto) {
    return this.ecopointsService.update(updateEcopointDto).then(() => {});
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('admin/delete/:id')
  remove(@Param('id') id: string) {
    return this.ecopointsService.remove(id).then(() => {});
  }
}
