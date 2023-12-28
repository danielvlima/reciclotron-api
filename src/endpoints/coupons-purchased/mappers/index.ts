import { ResponseCouponsPurchasedDto } from '../dto';
import { CouponsPurchased } from '../entities/coupons-purchased.entity';

export const toCouponsPurchasedDTO = (
  data: CouponsPurchased,
): ResponseCouponsPurchasedDto => {
  return {
    id: Number(data.id),
    usuarioCPF: data.usuarioCPF,
    cupomId: Number(data.cupomId),
    criadoEm: data.criadoEm,
    expiraEm: data.expiraEm,
    titulo: data.cupom.nome,
    empresa: data.cupom.empresa.nomeFantasia,
    regras: data.cupom.regras,
    logo: data.cupom.empresa.logo ?? '',
  };
};
