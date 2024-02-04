import { $Enums } from '@prisma/client';
import { Address } from 'src/endpoints/addresses/entities/address.entity';

export class Ecopoint {
  id: string;
  nome: string;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date | null;
  enderecoId: bigint;
  enderecos: Address;
  tipo: $Enums.TipoEcoponto;
}
