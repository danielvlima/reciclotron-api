import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/code-generator/code-generator.module';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('createUser')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() email: string, password: string) {
    return this.usersService.findOne(email).then((user) => {
      const passwordSplitted = user.senha.split(':');
      const passwordHashed = CryptoModule.sha256(password, passwordSplitted[1]);

      if (passwordHashed === passwordSplitted[0]) {
        return user;
      }
    });
  }

  @MessagePattern('updateUser')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.cpf, updateUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload() cpf: string) {
    return this.usersService.remove(cpf);
  }

  @MessagePattern('generateCode')
  createCode(@Payload() cpf: string) {
    const code = CodeGeneratorModule.new();
    return this.usersService.updateRecoveryCode(cpf, code);
  }

  @MessagePattern('checkCode')
  checkCode(@Payload() cpf: string, code: string) {
    return this.usersService.findOneWithCpf(cpf).then((user) => {
      const now = new Date();
      const limitDate = new Date(user.codigoRecuperacaoCriadoEm!);
      limitDate.setMinutes(limitDate.getMinutes() + 15);

      if (now.getTime() - limitDate.getTime() < 0) {
        return user.codigoRecuperacao === code;
      }
      return false;
    });
  }
}
