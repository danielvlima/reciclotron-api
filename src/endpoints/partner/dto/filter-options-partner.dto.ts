import { ApiProperty } from '@nestjs/swagger';
import { TypePartnerEnum } from '../enum/type-partner.enum';

export class FilterOptionsPartnerDto {
  @ApiProperty()
  busca?: string;

  @ApiProperty({
    enum: ['FISICA', 'ONLINE', 'AMBOS'],
  })
  tipoEmpresa?: TypePartnerEnum;

  @ApiProperty()
  ativo?: boolean;
}
