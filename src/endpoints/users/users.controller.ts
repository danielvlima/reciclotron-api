import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  ResponseUserDto,
  UpdatePassWordUserDto,
} from './dto';
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
import { CpfGuard, RtGuard, UserGuard } from 'src/shared/guards';
import { TokenService } from 'src/shared/modules/auth/token.service';

@ApiTags('Usuários')
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: LoginDto): Promise<ResponseDto<Tokens>> {
    const user = await this.usersService.findOne(data.email);
    CryptoModule.checkPasssword(user.senha, data.senha);
    const token = await this.tokenService.getTokens(
      user.cpf,
      user.email,
      user.nivelPrivilegio.toString(),
    );
    await this.usersService.updateRtHash(user.cpf, token.refresh_token);
    return ResponseFactoryModule.generate<Tokens>(token);
  }

  @UseGuards(CpfGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@GetCurrentKey() cpf: string) {
    return this.usersService.logout(cpf).then(() => {});
  }

  @Public()
  @Post('sign-up')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseDto<Tokens>> {
    createUserDto.senha = CryptoModule.hashPassword(createUserDto.senha);
    const newUser = await this.usersService.create(createUserDto);
    const token = await this.tokenService.getTokens(
      newUser.cpf,
      newUser.email,
      newUser.nivelPrivilegio.toString(),
    );
    await this.usersService.updateRtHash(newUser.cpf, token.refresh_token);
    return ResponseFactoryModule.generate<Tokens>(token);
  }

  @UseGuards(CpfGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('get')
  async get(
    @GetCurrentKey() cpf: string,
  ): Promise<ResponseDto<ResponseUserDto>> {
    const user = await this.usersService.findOneWithCpf(cpf);
    const userDto = toUserDTO(user);
    return ResponseFactoryModule.generate<ResponseUserDto>(userDto);
  }

  @UseGuards(UserGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Patch('update')
  update(@Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.senha) {
      updateUserDto.senha = CryptoModule.hashPassword(updateUserDto.senha);
    }
    return this.usersService.update(updateUserDto).then((user) => {
      return ResponseFactoryModule.generate<ResponseUserDto>(toUserDTO(user));
    });
  }

  @UseGuards(UserGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('remove')
  remove(@GetCurrentKey() cpf: string) {
    return this.usersService.remove(cpf);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('recovery/check')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('recovery/updatePassword')
  updatePassword(
    @Body() data: UpdatePassWordUserDto,
  ): Promise<ResponseDto<ResponseUserDto>> {
    if (data.senha) {
      data.senha = CryptoModule.hashPassword(data.senha);
    }
    return this.usersService.update(data).then((user) => {
      return ResponseFactoryModule.generate<ResponseUserDto>(toUserDTO(user));
    });
  }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('recovery/:cpf')
  createCode(@Param('cpf') cpf: string) {
    const code = CodeGeneratorModule.new();
    return this.usersService.updateRecoveryCode(cpf, code);
  }

  @UseGuards(RtGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
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
