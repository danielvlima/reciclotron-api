import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import {
  CreateMaterialDto,
  ResponseMaterialDto,
  UpdateMaterialDto,
} from './dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import { toMaterialDTO } from './mappers';
import { ResponseDto } from 'src/shared/dto/response.dto';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialsService.create(createMaterialDto);
  }

  @Get('all?')
  findAll(
    @Query('ativo', new ParseBoolPipe()) ativo: boolean,
  ): Promise<ResponseDto<ResponseMaterialDto[]>> {
    return this.materialsService.findAll(ativo).then((materials) => {
      return ResponseFactoryModule.generate(
        materials.map((el) => toMaterialDTO(el)),
      );
    });
  }

  @HttpCode(204)
  @Patch()
  update(@Body() updateMaterialDto: UpdateMaterialDto) {
    return this.materialsService.update(
      updateMaterialDto.id,
      updateMaterialDto,
    );
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.materialsService.remove(id);
  }
}
