import { $Enums } from '@prisma/client';

export class Material {
  id: bigint;
  nome: string;
  valor: number;
  ativo: boolean;
  logo: string | null;
  criadoEm: Date;
  atualizadoEm: Date | null;
  ehAceitoTipoEcoponto: $Enums.TipoEcopontoAceitaMaterial;
}
