import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialDto } from './create-material.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {
  @ApiProperty()
  id: number;
}
