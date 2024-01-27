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
  UseGuards,
  HttpStatus,
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
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators';
import { AdminGuard, CpfGuard } from 'src/shared/guards';

@ApiTags('Materiais')
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @UseGuards(AdminGuard)
  @Public()
  @Post('create')
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialsService.create(createMaterialDto).then((value) => {
      return ResponseFactoryModule.generate<ResponseMaterialDto>(
        toMaterialDTO(value),
      );
    });
  }

  @UseGuards(CpfGuard)
  @Public()
  @Get('get/all?')
  findAll(
    @Query('ativo', new ParseBoolPipe()) ativo: boolean,
  ): Promise<ResponseDto<ResponseMaterialDto[]>> {
    return this.materialsService.findAll(ativo).then((materials) => {
      return ResponseFactoryModule.generate(
        materials.map((el) => toMaterialDTO(el)),
      );
    });
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('update')
  update(@Body() updateMaterialDto: UpdateMaterialDto) {
    return this.materialsService.update(updateMaterialDto).then((value) => {
      return ResponseFactoryModule.generate<ResponseMaterialDto>(
        toMaterialDTO(value),
      );
    });
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.materialsService.remove(id).then((value) => {
      return ResponseFactoryModule.generate<ResponseMaterialDto>(
        toMaterialDTO(value),
      );
    });
  }
}
