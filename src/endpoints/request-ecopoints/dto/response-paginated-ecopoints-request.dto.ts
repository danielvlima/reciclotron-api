import { ResponseRequestEcopointDto } from './response-request-ecopoint.dto';

export class ResponsePaginatedEcopointsRequestDto {
  total: number;
  novosEcopontos: ResponseRequestEcopointDto[];
}
