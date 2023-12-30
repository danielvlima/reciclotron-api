import { ResponseDiscountCouponDto } from '../dto';
import { DiscountCoupon } from '../entities/discount-coupon.entity';

export const toCouponsDescDTO = (
  c: DiscountCoupon,
  ramo?: string,
): ResponseDiscountCouponDto => {
  return {
    id: Number(c.id),
    cnpjEmpresa: c.cnpjEmpresa,
    nome: c.nome,
    valor: c.valor,
    quantidadeDisponiveis: c.quantidadeDisponiveis,
    ativo: c.ativo,
    regras: c.regras,
    ramo: ramo,
    nomeFantasia: c.empresa?.nomeFantasia,
    logo: c.empresa?.logo ?? '',
  };
};
