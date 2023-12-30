import { ResponseAddressDto, ResponsePartnerDto } from '../dto';
import { Address } from '../../../shared/entities/address.entity';
import { Partner } from '../entities/partner.entity';
import { TypePartnerEnum } from '../enum/type-partner.enum';

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
  };
};

export const toPartnerDTO = (p: Partner): ResponsePartnerDto => {
  return {
    cnpj: p.cnpj,
    logo: p.logo,
    email: p.email,
    telefone: p.telefone,
    nomeFantasia: p.nomeFantasia,
    razaoSocial: p.razaoSocial,
    ramo: p.ramo,
    ativo: p.ativo,
    tipoEmpresa: TypePartnerEnum[p.tipoEmpresa],
    enderecolojaOnline: p.enderecolojaOnline,
    endereco: p.endereco ? toAddressDTO(p.endereco) : null,
  };
};
