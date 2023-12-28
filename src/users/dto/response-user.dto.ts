import { UserGenderEnum } from '../enum/user-gender.enum';
import { UserLevelEnum } from '../enum/user-level.enum';

export class ResponseUserDto {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataAniversario: string;
  generoUsuario: UserGenderEnum;
  nivelPrivilegio: UserLevelEnum;
  pontos: number;
}
