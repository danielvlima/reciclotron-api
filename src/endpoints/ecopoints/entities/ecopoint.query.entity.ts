import { $Enums } from '@prisma/client';

export class EcopointQuery {
  ecoId: string;
  id: bigint;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date | null;
  enderecoId: bigint;
  tipo: $Enums.TipoEcoponto;
  nome: string;
  empresaParceiraCnpj: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  lat: number;
  long: number;
  distancia: number;
}
