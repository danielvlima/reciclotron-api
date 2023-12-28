import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestEcopointDto } from './create-request-ecopoint.dto';

export class UpdateRequestEcopointDto extends PartialType(CreateRequestEcopointDto) {}
