import { ApiProperty } from '@nestjs/swagger';
import { TypeEcopointEnum } from 'src/shared/enum/type-ecopoint.enum';

export class CreateEcopointDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  ativo: boolean | undefined;

  @ApiProperty()
  enderecoId: number;

  @ApiProperty({ enum: ['TOTEM', 'BOX'] })
  tipo: TypeEcopointEnum;
}
