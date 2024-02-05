export class CouponsPurchased {
  id: bigint;
  usuarioCPF: string;
  cupomId: bigint;
  cupomNome: string;
  cupomRegras: string;
  criadoEm: Date;
  expiraEm: Date;
  cupom: {
    empresa: {
      nomeFantasia: string;
      logo: string | null;
    };
  };
}
