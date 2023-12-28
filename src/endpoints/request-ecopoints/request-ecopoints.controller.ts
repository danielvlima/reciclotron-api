import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { RequestEcopointsService } from './request-ecopoints.service';
import { CreateRequestEcopointDto } from './dto/create-request-ecopoint.dto';
import { UpdateRequestEcopointDto } from './dto/update-request-ecopoint.dto';
import { RequestActionEcopoint } from './enum/request-action-ecopoint.enum';
import { CancelRequestEcopointDto } from './dto';

@Controller('request-ecopoints')
export class RequestEcopointsController {
  constructor(
    private readonly requestEcopointsService: RequestEcopointsService,
  ) {}

  @HttpCode(204)
  @Post()
  create(@Body() createRequestEcopointDto: CreateRequestEcopointDto) {
    if (createRequestEcopointDto.acao === RequestActionEcopoint.ADICIONAR) {
      return this.requestEcopointsService.createAddEcopoint(
        createRequestEcopointDto,
      );
    }
    return this.requestEcopointsService.create(createRequestEcopointDto);
  }

  @Get()
  findAll() {
    return this.requestEcopointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestEcopointsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequestEcopointDto: UpdateRequestEcopointDto,
  ) {
    return this.requestEcopointsService.update(+id, updateRequestEcopointDto);
  }

  @HttpCode(204)
  @Post('cancel')
  cancel(@Body() data: CancelRequestEcopointDto) {
    return this.requestEcopointsService.cancel(data);
  }
}
