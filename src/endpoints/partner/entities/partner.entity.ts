import { $Enums } from '@prisma/client';
import { Address } from '../../../shared/entities/address.entity';

export class Partner {
  cnpj: string;
  logo: string | null;
  email: string;
  telefone: string;
  nomeFantasia: string;
  razaoSocial: string;
  senha: string;
  ramo: string;
  ativo: boolean;
  tipoEmpresa: $Enums.TipoEmpresa;
  enderecolojaOnline: string | null;
  criadoEm: Date;
  atualizadoEm: Date | null;
  endereco: Address | null;
  codigoRecuperacao: string | null;
  codigoRecuperacaoCriadoEm: Date | null;
}
