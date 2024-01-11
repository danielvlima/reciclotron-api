import { TypeEcopointEnum } from 'src/shared/enum/type-ecopoint.enum';
import { ResponseRequestEcopointDto } from '../dto';
import { RequestEcopoint } from '../entities/request-ecopoint.entity';
import { RequestActionEcopoint } from '../enum/request-action-ecopoint.enum';

export const toEcopointRequestDTO = (
  data: RequestEcopoint,
): ResponseRequestEcopointDto => {
  return {
    id: Number(data.id),
    cnpjEmpresa: data.cnpjEmpresa,
    acao: RequestActionEcopoint[data.acao],
    tipoEcoponto: data.tipoEcoponto
      ? TypeEcopointEnum[data.tipoEcoponto]
      : null,
    ecopontoId: data.ecopontoId ?? '',
    agendadoPara: data.agendadoPara,
    atendidoEm: data.atendidoEm,
  };
};
