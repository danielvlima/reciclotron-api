export class DiscountCoupon {
  id: bigint;
  cnpjEmpresa: string;
  nome: string;
  valor: number;
  quantidadeDisponiveis: number;
  ativo: boolean;
  regras: string;
  criadoEm: Date;
  atualizadoEm: Date | null;
  empresa?: {
    ramo: string;
    nomeFantasia: string;
    logo: string | null;
  };
}
