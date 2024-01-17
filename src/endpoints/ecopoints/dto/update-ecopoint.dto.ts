import { PartialType } from '@nestjs/mapped-types';
import { CreateEcopointDto } from './create-ecopoint.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEcopointDto extends PartialType(CreateEcopointDto) {
  @ApiProperty()
  oldId: string;
}
