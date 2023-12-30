import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EcopintsService } from './ecopints.service';
import { CreateEcopintDto } from './dto/create-ecopint.dto';
import { UpdateEcopintDto } from './dto/update-ecopint.dto';

@Controller('ecopints')
export class EcopintsController {
  constructor(private readonly ecopintsService: EcopintsService) {}

  @Post()
  create(@Body() createEcopintDto: CreateEcopintDto) {
    return this.ecopintsService.create(createEcopintDto);
  }

  @Get()
  findAll() {
    return this.ecopintsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ecopintsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEcopintDto: UpdateEcopintDto) {
    return this.ecopintsService.update(+id, updateEcopintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ecopintsService.remove(+id);
  }
}
