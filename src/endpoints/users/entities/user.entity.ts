import { $Enums } from '@prisma/client';

export class User {
  cpf: string;
  email: string;
  telefone: string;
  nome: string;
  senha: string;
  pontos: number;
  dataAniversario: Date;
  generoUsuario: $Enums.GeneroUsuario;
  nivelPrivilegio: $Enums.RegraPriviegio;
  criadoEm: Date;
  atualizadoEm: Date | null;
  codigoRecuperacao: string | null;
  codigoRecuperacaoCriadoEm: Date | null;
}
