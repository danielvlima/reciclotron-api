export class CouponsPurchased {
  id: bigint;
  usuarioCPF: string;
  cupomId: bigint;
  criadoEm: Date;
  expiraEm: Date;
  cupom: {
    nome: string;
    empresa: {
      nomeFantasia: string;
      logo: string | null;
    };
    regras: string;
  };
}
