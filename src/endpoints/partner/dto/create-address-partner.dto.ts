import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressPartnerDTO {
  @ApiProperty()
  rua: string;

  @ApiProperty()
  numero: string;

  @ApiProperty()
  complemento: string;

  @ApiProperty()
  bairro: string;

  @ApiProperty()
  cidade: string;

  @ApiProperty()
  uf: string;

  @ApiProperty()
  cep: string;

  @ApiProperty()
  lat: number;

  @ApiProperty()
  long: number;
}
