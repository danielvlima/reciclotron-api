import { UserGenderEnum } from '../enum/user-gender.enum';

export class CreateUserDto {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  dataAniversario: Date;
  generoUsuario: UserGenderEnum;
}
