import { ResponseEcopointDto } from './response-ecopoint.dto';

export class ResponsePaginatedEcopointsDto {
  ecopontos: ResponseEcopointDto[];
  total: number;
}
