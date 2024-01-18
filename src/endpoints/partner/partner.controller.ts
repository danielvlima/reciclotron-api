import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import {
  CreatePartnerDto,
  ResponsePartnerDto,
  UpdatePartnerDto,
  UpdateAddressPartnerDto,
  GetPaginatedPartnerDto,
  ResponsePaginatedPartnerDto,
} from './dto';

import { LoginDto } from 'src/shared/dto/login.dto';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/shared/modules/code-generator/code-generator.module';
import { CheckCodeDto } from 'src/shared/dto/check-code.dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { toPartnerDTO } from './mapper';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Empresas Parceiras')
@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  create(@Body() createPartnerDto: CreatePartnerDto) {
    createPartnerDto.senha = CryptoModule.hashPassword(createPartnerDto.senha);
    return this.partnerService.create(createPartnerDto).then((newPartner) => {
      return ResponseFactoryModule.generate(toPartnerDTO(newPartner));
    });
  }

  @HttpCode(200)
  @Post('paginated')
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

  @HttpCode(200)
  @Post('login')
  login(@Body() data: LoginDto): Promise<ResponseDto<ResponsePartnerDto>> {
    return this.partnerService.findOne(data.email).then((partner) => {
      CryptoModule.checkPasssword(partner.senha, data.senha);
      return ResponseFactoryModule.generate(toPartnerDTO(partner));
    });
  }

  @HttpCode(200)
  @Patch()
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

  @HttpCode(200)
  @Patch('address/:cnpj')
  updateAddress(
    @Param('cnpj') cnpj: string,
    @Body() data: UpdateAddressPartnerDto,
  ) {
    return this.partnerService.updateAddress(cnpj, data).then((partner) => {
      return ResponseFactoryModule.generate(toPartnerDTO(partner));
    });
  }

  @HttpCode(204)
  @Delete(':cnpj')
  remove(@Param('cnpj') cnpj: string) {
    return this.partnerService.remove(cnpj);
  }

  @HttpCode(204)
  @Post('recovery/:cnpj')
  createCode(@Param('cnpj') cnpj: string) {
    const code = CodeGeneratorModule.new();
    return this.partnerService.updateRecoveryCode(cnpj, code);
  }

  @HttpCode(200)
  @Post('checkRecoveryCode')
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

  @HttpCode(204)
  @Post('logout/:cnpj')
  logout(@Param('cnpj') cnpj: string) {
    this.partnerService.logout(cnpj).then(() => {});
  }

  @HttpCode(200)
  @Post('token/refresh')
  refreshToken(): Promise<ResponseDto<string>> {
    return this.partnerService.refreshToken();
  }
}
