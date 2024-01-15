import { Address } from 'src/endpoints/addresses/entities/address.entity';
import { ResponseAddressDto } from '../dto';

export const toAddressDTO = (a: Address): ResponseAddressDto => {
  return {
    id: Number(a.id),
    rua: a.rua,
    numero: a.numero,
    complemento: a.complemento,
    bairro: a.bairro,
    cidade: a.cidade,
    uf: a.uf,
    cep: a.cep,
    lat: a.lat,
    long: a.long,
    nomeFantasiaEmpresa: a.empresa.nomeFantasia,
  };
};
