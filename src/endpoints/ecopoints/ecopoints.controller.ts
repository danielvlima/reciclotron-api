import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EcopointsService } from './ecopoints.service';
import { CreateEcopointDto } from './dto/create-ecopoint.dto';
import { UpdateEcopointDto } from './dto/update-ecopoint.dto';

@Controller('ecopoints')
export class EcopointsController {
  constructor(private readonly ecopointsService: EcopointsService) {}

  @Post()
  create(@Body() createEcopointDto: CreateEcopointDto) {
    return this.ecopointsService.create(createEcopointDto);
  }

  @Get()
  findAll() {
    return this.ecopointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ecopointsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEcopointDto: UpdateEcopointDto) {
    return this.ecopointsService.update(+id, updateEcopointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ecopointsService.remove(+id);
  }
}
