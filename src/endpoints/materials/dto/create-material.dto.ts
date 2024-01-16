import { ApiProperty } from '@nestjs/swagger';
import { TypeEcopontoAccepted } from '../enum/type-ecoponto-accepted.enum';

export class CreateMaterialDto {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  valor: number;

  @ApiProperty()
  logo: string;

  @ApiProperty({
    enum: ['TOTEM', 'BOX', 'TODOS'],
  })
  ehAceitoTipoEcoponto: TypeEcopontoAccepted;
}
