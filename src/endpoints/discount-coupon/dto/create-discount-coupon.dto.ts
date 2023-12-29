export class CreateDiscountCouponDto {
  nome: string;
  cnpjEmpresa: string;
  valor: number;
  quantidadeDisponiveis: number;
  ativo: boolean;
  regras: string;
}
