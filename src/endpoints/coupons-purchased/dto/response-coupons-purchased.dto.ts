export class ResponseCouponsPurchasedDto {
  id: number;
  usuarioCPF: string;
  cupomId: number;
  titulo: string;
  empresa: string;
  logo: string;
  criadoEm: Date;
  expiraEm: Date;
  regras: string;
}
