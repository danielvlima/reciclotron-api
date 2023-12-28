import { ResponseUserDto } from '../dto';
import { User } from '../entities/user.entity';
import { UserGenderEnum } from '../enum/user-gender.enum';
import { UserLevelEnum } from '../enum/user-level.enum';

export const toUserDTO = (u: User): ResponseUserDto => {
  return {
    cpf: u.cpf,
    nome: u.nome,
    pontos: u.pontos,
    email: u.email,
    telefone: u.telefone,
    dataAniversario: u.dataAniversario.toISOString(),
    generoUsuario: UserGenderEnum[u.generoUsuario],
    nivelPrivilegio: UserLevelEnum[u.nivelPrivilegio],
  };
};
