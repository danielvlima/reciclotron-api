import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import {
  CreatePartnerDto,
  ResponsePartnerDto,
  UpdatePartnerDto,
  UpdateAddressPartnerDto,
  GetPaginatedPartnerDto,
  ResponsePaginatedPartnerDto,
  UpdatePasswordPartnerDto,
  UpdatePartnerWithAdmDto,
} from './dto';
import {
  RecoveryDto,
  ResponseDto,
  CheckCodeDto,
  LoginDto,
} from 'src/shared/dto';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/shared/modules/code-generator/code-generator.module';

import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';

import { toPartnerDTO } from './mapper';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentEntity, GetCurrentKey, Public } from 'src/shared/decorators';
import { Tokens } from 'src/shared/types';
import {
  AdminGuard,
  PartnerGuard,
  PartnerRecoveryGuard,
  RtGuard,
} from 'src/shared/guards';
import { TokenService } from 'src/shared/modules/auth/token.service';
import {
  AccessDaniedException,
  CodeCheckedException,
  CodeUncheckedException,
  ExpiredCodeException,
  PasswordLengthException,
} from 'src/exceptions';
import { MailService } from 'src/shared/modules/mail/mail.service';
import { env } from 'process';

@ApiTags('Empresas Parceiras')
@Controller('partner')
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService,
    private tokenService: TokenService,
    private mailerService: MailService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: LoginDto): Promise<ResponseDto<Tokens>> {
    const partner = await this.partnerService.findOne(data.email);
    CryptoModule.checkPasssword(partner.senha, data.senha);
    const token = await this.tokenService.getTokens(
      partner.cnpj,
      partner.email,
      'EMPRESA',
    );
    await this.partnerService.updateRtHash(partner.cnpj, token.refresh_token);
    return ResponseFactoryModule.generate(token);
  }

  @UseGuards(PartnerGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@GetCurrentKey() cnpj: string) {
    this.partnerService.logout(cnpj).then(() => {});
  }

  @UseGuards(PartnerGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('get')
  async get(
    @GetCurrentKey() cnpj: string,
  ): Promise<ResponseDto<ResponsePartnerDto>> {
    const partner = await this.partnerService.findOneWithCnpj(cnpj);
    const partnerDto = toPartnerDTO(partner);
    return ResponseFactoryModule.generate(partnerDto);
  }

  @UseGuards(PartnerGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Patch('update')
  async update(@Body() updatePartnerDto: UpdatePartnerDto) {
    if (updatePartnerDto.senha) {
      if (updatePartnerDto.senha.length < Number(env.PASSWORD_LENGTH)) {
        throw new PasswordLengthException();
      }
      updatePartnerDto.senha = CryptoModule.hashPassword(
        updatePartnerDto.senha,
      );
    }
    const partner = await this.partnerService.update(updatePartnerDto);
    if (updatePartnerDto.senha) {
      await this.mailerService.sendPasswordUpdated(
        partner.email,
        partner.nomeFantasia,
      );
    } else {
      await this.mailerService.sendProfileUpdated(
        partner.email,
        partner.nomeFantasia,
      );
    }
    return ResponseFactoryModule.generate(toPartnerDTO(partner));
  }

  @UseGuards(PartnerGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Patch('update/address')
  async updateAddress(
    @GetCurrentKey() cnpj: string,
    @Body() data: UpdateAddressPartnerDto,
  ) {
    const partner = await this.partnerService.updateAddress(cnpj, data);
    await this.mailerService.sendProfileUpdated(
      partner.email,
      partner.nomeFantasia,
    );
    return ResponseFactoryModule.generate(toPartnerDTO(partner));
  }

  @UseGuards(AdminGuard)
  @Public()
  @Post('admin/create')
  async create(@Body() createPartnerDto: CreatePartnerDto) {
    if (createPartnerDto.senha.length < Number(env.PASSWORD_LENGTH)) {
      throw new PasswordLengthException();
    }
    createPartnerDto.senha = CryptoModule.hashPassword(createPartnerDto.senha);
    const newPartner = await this.partnerService.create(createPartnerDto);
    const partnerDto = toPartnerDTO(newPartner);
    await this.mailerService.sendSignUp(newPartner.email, true);
    return ResponseFactoryModule.generate(partnerDto);
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('admin/paginated')
  findPaginated(
    @Body() data: GetPaginatedPartnerDto,
  ): Promise<ResponseDto<ResponsePaginatedPartnerDto>> {
    return this.partnerService.count(data.filtro).then((total) => {
      return this.partnerService.findPaginated(data).then((parters) => {
        return ResponseFactoryModule.generate({
          total,
          empresas: parters.map((el) => toPartnerDTO(el)),
        });
      });
    });
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Patch('admin/update')
  async adminUpdate(@Body() updatePartnerDto: UpdatePartnerWithAdmDto) {
    if (updatePartnerDto.senha) {
      throw new AccessDaniedException();
    }
    if (updatePartnerDto.newCnpj) {
      await this.partnerService.findOneWithCnpj(updatePartnerDto.newCnpj);
    }

    const partner = await this.partnerService.update(
      updatePartnerDto,
      updatePartnerDto.newCnpj,
    );
    return ResponseFactoryModule.generate(toPartnerDTO(partner));
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('admin/delete/:cnpj')
  async remove(@Param('cnpj') cnpj: string) {
    const partner = await this.partnerService.remove(cnpj);
    await this.mailerService.sendGoodbye(partner.email, partner.nomeFantasia);
    return;
  }

  @UseGuards(PartnerRecoveryGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('recovery/check')
  async checkCode(
    @GetCurrentKey() cnpj: string,
    @Body() data: CheckCodeDto,
  ): Promise<ResponseDto<boolean>> {
    const partner = await this.partnerService.findOneWithCnpj(cnpj);
    if (partner.codigoRecuperacaoVerificado) {
      throw new CodeCheckedException();
    }
    const now = new Date();
    const limitDate = new Date(partner.codigoRecuperacaoCriadoEm!);
    limitDate.setMinutes(limitDate.getMinutes() + 15);

    if (now.getTime() - limitDate.getTime() < 0) {
      const response = partner.codigoRecuperacao === data.codigo;
      if (response) {
        await this.partnerService.checkedRecoveryCode(cnpj);
      }

      return ResponseFactoryModule.generate(response);
    }

    throw new ExpiredCodeException();
  }

  @UseGuards(PartnerRecoveryGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('recovery/updatePassword')
  async updatePassword(
    @GetCurrentKey() cnpj: string,
    @Body() data: UpdatePasswordPartnerDto,
  ) {
    const partner = await this.partnerService.findOneWithCnpj(cnpj);
    if (!partner.codigoRecuperacaoVerificado) {
      throw new CodeUncheckedException();
    }
    if (data.senha) {
      data.senha = CryptoModule.hashPassword(data.senha);
    }
    await this.partnerService.update({
      cnpj,
      senha: data.senha,
    });
    await this.mailerService.sendPasswordUpdated(
      partner.email,
      partner.nomeFantasia,
    );
    return;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('recovery/new')
  async createCode(@Body() data: RecoveryDto) {
    const partner = await this.partnerService.findOneWithCnpj(data.key);
    const code = CodeGeneratorModule.new();
    await this.partnerService.updateRecoveryCode(data.key, code);
    const token: Tokens = await this.tokenService.getRecoveryTokens(data.key);
    await this.mailerService.sendForgotPassword(
      partner.email,
      partner.nomeFantasia,
      code,
    );
    return ResponseFactoryModule.generate<Tokens>(token);
  }

  @UseGuards(RtGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('token/refresh')
  refreshToken(
    @GetCurrentKey() cnpj: string,
    @GetCurrentEntity('refreshToken') rt: string,
  ): Promise<ResponseDto<Tokens>> {
    return this.partnerService
      .refreshToken(cnpj, rt)
      .then((value) => ResponseFactoryModule.generate(value));
  }
}
