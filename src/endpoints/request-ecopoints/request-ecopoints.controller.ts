import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequestEcopointsService } from './request-ecopoints.service';
import { CreateRequestEcopointDto } from './dto/create-request-ecopoint.dto';
import { UpdateRequestEcopointDto } from './dto/update-request-ecopoint.dto';

@Controller('request-ecopoints')
export class RequestEcopointsController {
  constructor(private readonly requestEcopointsService: RequestEcopointsService) {}

  @Post()
  create(@Body() createRequestEcopointDto: CreateRequestEcopointDto) {
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
  update(@Param('id') id: string, @Body() updateRequestEcopointDto: UpdateRequestEcopointDto) {
    return this.requestEcopointsService.update(+id, updateRequestEcopointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestEcopointsService.remove(+id);
  }
}
