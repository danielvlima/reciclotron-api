import { ResponseRequestEcopointDto } from './response-request-ecopoint.dto';

export class ResponsePaginatedEcopointsRequestDto {
  total: number;
  ecopontos: ResponseRequestEcopointDto[];
}
