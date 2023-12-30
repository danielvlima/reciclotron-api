import { PartialType } from '@nestjs/mapped-types';
import { CreateEcopointDto } from './create-ecopoint.dto';

export class UpdateEcopointDto extends PartialType(CreateEcopointDto) {}
