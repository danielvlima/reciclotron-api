import { ApiProperty } from '@nestjs/swagger';
import { TypePartnerEnum } from '../enum/type-partner.enum';
import { CreateAddressPartnerDTO } from './create-address-partner.dto';

export class CreatePartnerDto {
  @ApiProperty()
  cnpj: string;

  @ApiProperty()
  logo: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  senha: string;

  @ApiProperty()
  telefone: string;

  @ApiProperty()
  nomeFantasia: string;

  @ApiProperty()
  razaoSocial: string;

  @ApiProperty()
  ramo: string;

  @ApiProperty()
  ativo: boolean | undefined;

  @ApiProperty({
    enum: ['FISICA', 'ONLINE', 'AMBOS'],
  })
  tipoEmpresa: TypePartnerEnum;

  @ApiProperty()
  enderecolojaOnline: string | null;

  @ApiProperty()
  endereco: CreateAddressPartnerDTO;
}
