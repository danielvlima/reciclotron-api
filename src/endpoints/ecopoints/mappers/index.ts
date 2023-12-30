import { TypeEcopointEnum } from 'src/shared/enum/type-ecopoint.enum';
import { ResponseEcopointDto } from '../dto';
import { Ecopoint } from '../entities/ecopoint.entity';
import { EcopointQuery } from '../entities/ecopoint.query.entity';

export const toEcopontoDTO = (e: Ecopoint): ResponseEcopointDto => {
  return {
    id: e.id,
    nome: e.nome,
    ativo: e.ativo,
    endereco: {
      id: Number(e.enderecos.id),
      rua: e.enderecos.rua,
      numero: e.enderecos.numero,
      complemento: e.enderecos.complemento,
      bairro: e.enderecos.bairro,
      cidade: e.enderecos.cidade,
      uf: e.enderecos.uf,
      cep: e.enderecos.cep,
      lat: e.enderecos.lat,
      long: e.enderecos.long,
    },
    tipo: TypeEcopointEnum[e.tipo],
  };
};

export const toEcopontoDTOFromQuery = (
  e: EcopointQuery,
): ResponseEcopointDto => {
  return {
    id: e.ecoId,
    nome: e.nome,
    ativo: e.ativo,
    endereco: {
      id: Number(e.enderecoId),
      rua: e.rua,
      numero: e.numero,
      complemento: e.complemento,
      bairro: e.bairro,
      cidade: e.cidade,
      uf: e.uf,
      cep: e.cep,
      lat: e.lat,
      long: e.long,
    },
    tipo: TypeEcopointEnum[e.tipo],
    distancia: e.distancia,
  };
};
