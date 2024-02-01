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
} from './dto';

import { LoginDto } from 'src/shared/dto/login.dto';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/shared/modules/code-generator/code-generator.module';
import { CheckCodeDto } from 'src/shared/dto/check-code.dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { toPartnerDTO } from './mapper';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentEntity, GetCurrentKey, Public } from 'src/shared/decorators';
import { Tokens } from 'src/shared/types';
import { AdminGuard, PartnerGuard, RtGuard } from 'src/shared/guards';
import { TokenService } from 'src/shared/modules/auth/token.service';

@ApiTags('Empresas Parceiras')
@Controller('partner')
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService,
    private tokenService: TokenService,
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
  update(@Body() updatePartnerDto: UpdatePartnerDto) {
    if (updatePartnerDto.senha) {
      updatePartnerDto.senha = CryptoModule.hashPassword(
        updatePartnerDto.senha,
      );
    }
    return this.partnerService.update(updatePartnerDto).then((partner) => {
      return ResponseFactoryModule.generate(toPartnerDTO(partner));
    });
  }

  @UseGuards(PartnerGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Patch('update/address')
  updateAddress(
    @GetCurrentKey() cnpj: string,
    @Body() data: UpdateAddressPartnerDto,
  ) {
    return this.partnerService.updateAddress(cnpj, data).then((partner) => {
      return ResponseFactoryModule.generate(toPartnerDTO(partner));
    });
  }

  @UseGuards(AdminGuard)
  @Public()
  @Post('admin/create')
  async create(@Body() createPartnerDto: CreatePartnerDto) {
    createPartnerDto.senha = CryptoModule.hashPassword(createPartnerDto.senha);
    const newPartner = await this.partnerService.create(createPartnerDto);
    const partnerDto = toPartnerDTO(newPartner);
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('admin/delete/:cnpj')
  remove(@Param('cnpj') cnpj: string) {
    return this.partnerService.remove(cnpj).then((partner) => {
      return ResponseFactoryModule.generate(toPartnerDTO(partner));
    });
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('recovery/check')
  checkCode(@Body() data: CheckCodeDto): Promise<ResponseDto<boolean>> {
    return this.partnerService.findOneWithCnpj(data.key).then((partner) => {
      const now = new Date();
      const limitDate = new Date(partner.codigoRecuperacaoCriadoEm!);
      limitDate.setMinutes(limitDate.getMinutes() + 15);

      if (now.getTime() - limitDate.getTime() < 0) {
        return ResponseFactoryModule.generate(
          partner.codigoRecuperacao === data.codigo,
        );
      }
      return ResponseFactoryModule.generate(false);
    });
  }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('recovery/updatePassword')
  updatePassword(
    @Body() data: UpdatePasswordPartnerDto,
  ): Promise<ResponseDto<ResponsePartnerDto>> {
    if (data.senha) {
      data.senha = CryptoModule.hashPassword(data.senha);
    }
    return this.partnerService.update(data).then((partner) => {
      return ResponseFactoryModule.generate<ResponsePartnerDto>(
        toPartnerDTO(partner),
      );
    });
  }

  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('recovery/:cnpj')
  createCode(@Param('cnpj') cnpj: string) {
    const code = CodeGeneratorModule.new();
    return this.partnerService.updateRecoveryCode(cnpj, code);
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
