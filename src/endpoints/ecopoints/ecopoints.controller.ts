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
} from '@nestjs/common';
import { EcopointsService } from './ecopoints.service';
import { CreateEcopointDto } from './dto/create-ecopoint.dto';
import { UpdateEcopointDto } from './dto/update-ecopoint.dto';
import {
  PaginatedEcopointDto,
  PaginatedEcopointsDepositDto,
  ResponseEcopointDto,
  ResponsePaginatedEcopointsDto,
} from './dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';
import { toEcopontoDTO, toEcopontoDTOFromQuery } from './mappers';
import { RequestEcopointsService } from '../request-ecopoints/request-ecopoints.service';
import { toEcopointRequestDTO } from '../request-ecopoints/mappers';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentKey, Public } from 'src/shared/decorators';
import { AdminGuard, PartnerGuard, UserGuard } from 'src/shared/guards';
import { PartnerService } from '../partner/partner.service';
import { UsersService } from '../users/users.service';
import { MailService } from 'src/shared/modules/mail/mail.service';

@ApiTags('Ecopontos')
@Controller('ecopoints')
export class EcopointsController {
  constructor(
    private readonly ecopointsService: EcopointsService,
    private readonly partnerService: PartnerService,
    private readonly requestEcopointsService: RequestEcopointsService,
    private usersService: UsersService,
    private mailerService: MailService,
  ) {}

  @UseGuards(AdminGuard)
  @Public()
  @Post('admin/create')
  async create(@Body() createEcopointDto: CreateEcopointDto) {
    const adminEmail = await this.usersService.getAdminEmails();

    const ecopoint = await this.ecopointsService.create(createEcopointDto);
    const responseDto = toEcopontoDTO(ecopoint);

    await this.mailerService.sendAdminEcopointRegistered(adminEmail, ecopoint);
    
    return ResponseFactoryModule.generate<ResponseEcopointDto>(responseDto);
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('admin/find')
  async findPaginated(@Body() data: PaginatedEcopointDto) {
    const total = await this.ecopointsService.count(
      data.busca,
      data.enderecoId,
      data.ativo,
      data.tipo,
    );

    if (!total) {
      return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
        total,
        ecopontos: [],
      });
    }

    const ecopoints = await this.ecopointsService.findPaginated(data);

    if (data.enderecoId) {
      const list = ecopoints.map((el) => toEcopontoDTO(el));
      for (let i = 0; i < list.length; i++) {
        const action = await this.requestEcopointsService.findOneRequest(
          list[i].id,
        );
        list[i].actionrequest = action ? toEcopointRequestDTO(action) : null;
      }
      return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
        total,
        ecopontos: list,
      });
    }
    return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
      total,
      ecopontos: ecopoints.map((el) => toEcopontoDTO(el)),
    });
  }

  @UseGuards(PartnerGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('partner/find')
  async findPaginatedPartner(
    @GetCurrentKey() cnpj: string,
    @Body() data: PaginatedEcopointDto,
  ) {
    const partner = await this.partnerService.findOneWithCnpj(cnpj);
    data.enderecoId = Number(partner.endereco.id);

    const total = await this.ecopointsService.count(
      data.busca,
      data.enderecoId,
      true,
    );

    if (!total) {
      return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
        total,
        ecopontos: [],
      });
    }

    const ecopoints = await this.ecopointsService.findPaginated(data);

    const list = ecopoints.map((el) => toEcopontoDTO(el));
    for (let i = 0; i < list.length; i++) {
      const action = await this.requestEcopointsService.findOneRequest(
        list[i].id,
      );
      list[i].actionrequest = action ? toEcopointRequestDTO(action) : null;
    }
    return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
      total,
      ecopontos: list,
    });
  }

  @UseGuards(UserGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('user/find')
  async findForDeposit(@Body() data: PaginatedEcopointsDepositDto) {
    const total = await this.ecopointsService.countEcopointsForDeposit(
      data.hasItemForBox,
      data.city,
    );

    if (!total) {
      return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
        total,
        ecopontos: [],
      });
    }
    const ecopoints =
      await this.ecopointsService.findPaginatedEcopointsForDeposit(data);

    return ResponseFactoryModule.generate<ResponsePaginatedEcopointsDto>({
      total,
      ecopontos: ecopoints.map((el) => toEcopontoDTOFromQuery(el)),
    });
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('admin/update')
  update(@Body() updateEcopointDto: UpdateEcopointDto) {
    return this.ecopointsService.update(updateEcopointDto).then(() => {});
  }

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('admin/delete/:id')
  async remove(@Param('id') id: string) {
    const adminEmail = await this.usersService.getAdminEmails();
    const ecopoint = await this.ecopointsService.findOne(id);

    await this.mailerService.sendAdminEcopointRemoved(adminEmail,ecopoint);
    return this.ecopointsService.remove(id).then(() => {});
  }
}
