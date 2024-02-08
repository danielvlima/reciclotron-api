import { ResponseMaterialDto } from '../dto';
import { Material } from '../entities/material.entity';
import { TypeEcopontoAccepted } from '../enum/type-ecoponto-accepted.enum';

export const toMaterialDTO = (data: Material): ResponseMaterialDto => {
  return {
    id: Number(data.id),
    nome: data.nome,
    valor: data.valor,
    logo: data.logo,
    ehAceitoTipoEcoponto: TypeEcopontoAccepted[data.ehAceitoTipoEcoponto],
  };
};
