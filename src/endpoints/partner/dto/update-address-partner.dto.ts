export class UpdateAddressPartnerDto {
  id: number;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  lat?: number;
  long?: number;
}
