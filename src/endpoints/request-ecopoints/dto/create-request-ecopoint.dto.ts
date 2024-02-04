import { TypeEcopointEnum } from 'src/shared/enum/type-ecopoint.enum';
import { RequestActionEcopoint } from '../enum/request-action-ecopoint.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestEcopointDto {
  @ApiProperty({ enum: ['ADICIONAR', 'DEVOLUCAO', 'COLETAR'] })
  acao: RequestActionEcopoint;

  @ApiProperty({ enum: ['TOTEM', 'BOX'] })
  tipoEcoponto?: TypeEcopointEnum;

  @ApiProperty()
  ecopontoIds: string[];
}
