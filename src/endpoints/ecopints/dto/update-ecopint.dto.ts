import { PartialType } from '@nestjs/mapped-types';
import { CreateEcopintDto } from './create-ecopint.dto';

export class UpdateEcopintDto extends PartialType(CreateEcopintDto) {}
