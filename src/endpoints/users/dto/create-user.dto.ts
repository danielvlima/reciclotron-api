import { ApiProperty } from '@nestjs/swagger';
import { UserGenderEnum } from '../enum/user-gender.enum';

export class CreateUserDto {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  telefone: string;

  @ApiProperty()
  senha: string;

  @ApiProperty()
  dataAniversario: Date;

  @ApiProperty({
    enum: [
      'HOMEM_CIS',
      'HOMEM_TRANS',
      'MULHER_CIS',
      'MULHER_TRANS',
      'NAO_BINARIO',
    ],
  })
  generoUsuario: UserGenderEnum;
}
