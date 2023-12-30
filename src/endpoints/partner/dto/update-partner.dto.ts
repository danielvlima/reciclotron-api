import { PartialType } from '@nestjs/mapped-types';
import { CreatePartnerDto } from './create-partner.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {
  @ApiProperty()
  cnpj: string;
}
