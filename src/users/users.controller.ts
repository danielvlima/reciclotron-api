import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  CheckCodeUserDto,
  LoginUserDto,
} from './dto';
import { UsersService } from './users.service';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/code-generator/code-generator.module';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post()
  login(@Body() data: LoginUserDto) {
    return this.usersService.findOne(data.email).then((user) => {
      const passwordSplitted = user.senha.split(':');
      const passwordHashed = CryptoModule.sha256(
        data.senha,
        passwordSplitted[1],
      );

      if (passwordHashed === passwordSplitted[0]) {
        return user;
      }
    });
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.cpf, updateUserDto);
  }

  @Delete(':cpf')
  remove(@Param(':cpf') cpf: string) {
    return this.usersService.remove(cpf);
  }

  @Post(':cpf')
  createCode(@Param(':cpf') cpf: string) {
    const code = CodeGeneratorModule.new();
    return this.usersService.updateRecoveryCode(cpf, code);
  }

  @Post()
  checkCode(@Body() data: CheckCodeUserDto) {
    return this.usersService.findOneWithCpf(data.cpf).then((user) => {
      const now = new Date();
      const limitDate = new Date(user.codigoRecuperacaoCriadoEm!);
      limitDate.setMinutes(limitDate.getMinutes() + 15);

      if (now.getTime() - limitDate.getTime() < 0) {
        return user.codigoRecuperacao === data.code;
      }
      return false;
    });
  }
}
