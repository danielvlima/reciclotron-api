export class ResponseDiscountCouponDto {
  id: number;
  cnpjEmpresa: string;
  nome: string;
  valor: number;
  quantidadeDisponiveis: number;
  ativo: boolean | undefined;
  regras: string;
  ramo?: string;
  nomeFantasia?: string;
  logo: string;
}
