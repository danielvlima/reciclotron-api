import { Partner } from 'src/endpoints/partner/entities/partner.entity';

export class Address {
  id: bigint;
  cnpjEmpresa: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  lat: number;
  long: number;
  empresa?: Partner;
}
