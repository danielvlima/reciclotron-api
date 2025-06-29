import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import {
  RecoveryDto,
  CheckCodeDto,
  LoginDto,
  ResponseDto,
} from 'src/shared/dto';
import { UsersService } from './users.service';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/shared/modules/code-generator/code-generator.module';
import { toUserDTO } from './mappers';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentEntity, GetCurrentKey, Public } from 'src/shared/decorators';
import { Tokens } from 'src/shared/types';
import {
  CpfGuard,
  CpfRecoveryGuard,
  RtGuard,
  UserGuard,
} from 'src/shared/guards';
import { TokenService } from 'src/shared/modules/auth/token.service';
import {
  CodeCheckedException,
  CodeUncheckedException,
  CpfRegistredException,
  EmailRegistredException,
  ExpiredCodeException,
  NotFoundUserException,
  PasswordLengthException,
  PhoneRegistredException,
} from 'src/exceptions';
import { MailService } from 'src/shared/modules/mail/mail.service';
import { env } from 'process';

@ApiTags('Usuários')
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private tokenService: TokenService,
    private mailerService: MailService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: LoginDto): Promise<ResponseDto<Tokens>> {
    console.log(data);
    const user = await this.usersService.findOne(data.email);
    if (!user) {
      throw new NotFoundUserException();
    }
    CryptoModule.checkPassword(user.senha, data.senha);
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
    let user = await this.usersService
      .findOneWithCpf(createUserDto.cpf)
      .catch(() => null);

    if (user) {
      throw new CpfRegistredException();
    }

    user = await this.usersService
      .findOne(createUserDto.email)
      .catch(() => null);
    if (user) {
      throw new EmailRegistredException();
    }

    user = await this.usersService
      .findOneWithPhone(createUserDto.telefone)
      .catch(() => null);
    if (user) {
      throw new PhoneRegistredException();
    }

    if (createUserDto.senha.length < Number(env.PASSWORD_LENGTH)) {
      throw new PasswordLengthException();
    }
    createUserDto.senha = CryptoModule.hashPassword(createUserDto.senha);
    const newUser = await this.usersService.create(createUserDto);
    const token = await this.tokenService.getTokens(
      newUser.cpf,
      newUser.email,
      newUser.nivelPrivilegio.toString(),
    );
    await this.usersService.updateRtHash(newUser.cpf, token.refresh_token);
    await this.mailerService.sendSignUp(newUser.email);
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
  async update(@Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.senha) {
      if (updateUserDto.senha.length < Number(env.PASSWORD_LENGTH)) {
        throw new PasswordLengthException();
      }
      updateUserDto.senha = CryptoModule.hashPassword(updateUserDto.senha);
    }
    const user = await this.usersService.update(updateUserDto);
    if (updateUserDto.senha) {
      await this.mailerService.sendPasswordUpdated(user.email, user.nome);
    } else {
      await this.mailerService.sendProfileUpdated(user.email, user.nome);
    }
    return ResponseFactoryModule.generate<ResponseUserDto>(toUserDTO(user));
  }

  @UseGuards(UserGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('remove')
  async remove(@GetCurrentKey() cpf: string) {
    const user = await this.usersService.remove(cpf);
    await this.mailerService.sendGoodbye(user[2].email, user[2].nome);
    return;
  }

  @UseGuards(CpfRecoveryGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('recovery/check')
  async checkCode(
    @GetCurrentKey() cpf: string,
    @Body() data: CheckCodeDto,
  ): Promise<ResponseDto<boolean>> {
    const user = await this.usersService.findOneWithCpf(cpf);
    if (user.codigoRecuperacaoVerificado) {
      throw new CodeCheckedException();
    }
    const now = new Date();
    const limitDate = new Date(user.codigoRecuperacaoCriadoEm!);
    limitDate.setMinutes(limitDate.getMinutes() + 15);

    if (now.getTime() - limitDate.getTime() < 0) {
      const response = user.codigoRecuperacao === data.codigo;
      if (response) {
        await this.usersService.checkedRecoveryCode(cpf);
      }

      return ResponseFactoryModule.generate(response);
    }
    throw new ExpiredCodeException();
  }

  @UseGuards(CpfRecoveryGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('recovery/updatePassword')
  async updatePassword(
    @GetCurrentKey() cpf: string,
    @Body() data: UpdatePassWordUserDto,
  ) {
    const user = await this.usersService.findOneWithCpf(cpf);
    if (!user.codigoRecuperacaoVerificado) {
      throw new CodeUncheckedException();
    }
    if (data.senha) {
      if (data.senha.length < Number(env.PASSWORD_LENGTH)) {
        throw new PasswordLengthException();
      }
      data.senha = CryptoModule.hashPassword(data.senha);
    }
    await this.usersService.update({
      cpf,
      senha: data.senha,
    });

    await this.mailerService.sendPasswordUpdated(user.email, user.nome);
    return;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('recovery/new')
  async createCode(@Body() data: RecoveryDto) {
    const user = await this.usersService.findOneWithCpf(data.key);
    const code = CodeGeneratorModule.new();
    await this.usersService.updateRecoveryCode(data.key, code);
    const token: Tokens = await this.tokenService.getRecoveryTokens(data.key);
    await this.mailerService.sendForgotPassword(user.email, user.nome, code);
    return ResponseFactoryModule.generate<Tokens>(token);
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
