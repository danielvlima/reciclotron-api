import { toAddressDTO } from 'src/endpoints/addresses/mappers';
import { ResponsePartnerDto } from '../dto';
import { Partner } from '../entities/partner.entity';
import { TypePartnerEnum } from '../enum/type-partner.enum';

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
