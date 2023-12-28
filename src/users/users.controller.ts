import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  CheckCodeUserDto,
  LoginUserDto,
  ResponseUserDto,
} from './dto';
import { UsersService } from './users.service';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/code-generator/code-generator.module';
import { toUserDTO } from './mappers';
import { ResponseDto } from 'src/response.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() data: LoginUserDto): Promise<ResponseDto<ResponseUserDto>> {
    return this.usersService.findOne(data.email).then((user) => {
      const passwordSplitted = user.senha.split(':');
      const passwordHashed = CryptoModule.sha256(
        data.senha,
        passwordSplitted[1],
      );

      if (passwordHashed === passwordSplitted[0]) {
        return { body: toUserDTO(user) };
      }
    });
  }

  @HttpCode(204)
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.cpf, updateUserDto);
  }

  @HttpCode(204)
  @Delete(':cpf')
  remove(@Param(':cpf') cpf: string) {
    return this.usersService.remove(cpf);
  }

  @HttpCode(204)
  @Post('recovery/:cpf')
  createCode(@Param(':cpf') cpf: string) {
    const code = CodeGeneratorModule.new();
    return this.usersService.updateRecoveryCode(cpf, code);
  }

  @Post('recovery')
  checkCode(@Body() data: CheckCodeUserDto): Promise<ResponseDto<boolean>> {
    return this.usersService.findOneWithCpf(data.cpf).then((user) => {
      const now = new Date();
      const limitDate = new Date(user.codigoRecuperacaoCriadoEm!);
      limitDate.setMinutes(limitDate.getMinutes() + 15);

      if (now.getTime() - limitDate.getTime() < 0) {
        return { body: user.codigoRecuperacao === data.code };
      }
      return { body: false };
    });
  }
}
