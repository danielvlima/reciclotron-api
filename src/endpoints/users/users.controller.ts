import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, ResponseUserDto } from './dto';
import { UsersService } from './users.service';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/shared/modules/code-generator/code-generator.module';
import { toUserDTO } from './mappers';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import { LoginDto } from 'src/shared/dto/login.dto';
import { CheckCodeDto } from 'src/shared/dto/check-code.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentEntity, GetCurrentKey, Public } from 'src/shared/decorators';
import { Tokens } from 'src/shared/types';
import { RtGuard } from 'src/shared/guards';

@ApiTags('Usuários')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    createUserDto.senha = CryptoModule.hashPassword(createUserDto.senha);
    return this.usersService.create(createUserDto).then((newUser) => {
      return ResponseFactoryModule.generate<ResponseUserDto>(
        toUserDTO(newUser),
      );
    });
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  login(@Body() data: LoginDto): Promise<ResponseDto<ResponseUserDto>> {
    return this.usersService.findOne(data.email).then((user) => {
      CryptoModule.checkPasssword(user.senha, data.senha);
      return ResponseFactoryModule.generate<ResponseUserDto>(toUserDTO(user));
    });
  }

  @Public()
  @HttpCode(200)
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.senha) {
      updateUserDto.senha = CryptoModule.hashPassword(updateUserDto.senha);
    }
    return this.usersService.update(updateUserDto).then((user) => {
      return ResponseFactoryModule.generate<ResponseUserDto>(toUserDTO(user));
    });
  }

  @Public()
  @HttpCode(204)
  @Delete(':cpf')
  remove(@Param('cpf') cpf: string) {
    return this.usersService.remove(cpf);
  }

  @Public()
  @HttpCode(204)
  @Post('recovery/:cpf')
  createCode(@Param('cpf') cpf: string) {
    const code = CodeGeneratorModule.new();
    return this.usersService.updateRecoveryCode(cpf, code);
  }

  @Public()
  @HttpCode(200)
  @Post('checkRecoveryCode')
  checkCode(@Body() data: CheckCodeDto): Promise<ResponseDto<boolean>> {
    return this.usersService.findOneWithCpf(data.key).then((user) => {
      const now = new Date();
      const limitDate = new Date(user.codigoRecuperacaoCriadoEm!);
      limitDate.setMinutes(limitDate.getMinutes() + 15);

      if (now.getTime() - limitDate.getTime() < 0) {
        return ResponseFactoryModule.generate(
          user.codigoRecuperacao === data.codigo,
        );
      }
      return ResponseFactoryModule.generate(false);
    });
  }

  @Public()
  @HttpCode(204)
  @Post('logout')
  logout(@GetCurrentKey() cpf: string) {
    return this.usersService.logout(cpf).then(() => {});
  }

  @UseGuards(RtGuard)
  @Public()
  @HttpCode(200)
  @Post('token/refresh')
  refreshToken(
    @GetCurrentKey() cpf: string,
    @GetCurrentEntity('refreshToken') rt: string,
  ): Promise<ResponseDto<Tokens>> {
    return this.usersService
      .refreshToken(cpf, rt)
      .then((value) => ResponseFactoryModule.generate(value));
  }
}
