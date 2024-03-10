import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Body,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard, PartnerGuard } from 'src/shared/guards';
import { GetCurrentKey, Public } from 'src/shared/decorators';
import { FieldCountDto, StatisticsDatesDto } from './dto';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';

const convertToDate = (data: StatisticsDatesDto) => {
  const initialDate = new Date(data.anoInicial, data.mesInicial - 1, 1);
  const finalDate =
    data.mesFinal !== undefined && data.anoFinal !== undefined
      ? new Date(data.anoFinal, data.mesFinal - 1, 1)
      : new Date(data.anoInicial, data.mesInicial, 1);

  return {
    initial: initialDate,
    final: finalDate,
  };
};

@ApiTags('Estatísticas')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(AdminGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('partner')
  async partner(
    @GetCurrentKey() cnpj: string,
    @Body() data: StatisticsDatesDto,
  ) {
    const dates = convertToDate(data);

    const totalPurchased = await this.statisticsService.countAllRedeemedCoupons(
      dates.initial,
      dates.final,
      cnpj,
    );
    const totalUtilized = await this.statisticsService.countAllUtilizedCoupons(
      dates.initial,
      dates.final,
      cnpj,
    );
    const totalUserPurchased =
      await this.statisticsService.countAllUserRedeemedCoupons(
        dates.initial,
        dates.final,
        cnpj,
      );
    const totalUserUtilized =
      await this.statisticsService.countAllUserUtilizedCoupons(
        dates.initial,
        dates.final,
        cnpj,
      );

    return ResponseFactoryModule.generate<FieldCountDto[]>([
      {
        campo: 'Total de cupons resgatados',
        total: totalPurchased,
      },
      {
        campo: 'Total de cupons utilizados',
        total: totalUtilized,
      },
      {
        campo: 'Total de clientes que compraram os cupons',
        total: totalUserPurchased.length,
      },
      {
        campo: 'Total de clientes que utilizaram os cupons',
        total: totalUserUtilized.length,
      },
    ]);
  }

  @UseGuards(PartnerGuard)
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('admin')
  async admin(@Body() data: StatisticsDatesDto) {
    const dates = convertToDate(data);

    const toalRpts =
      await this.statisticsService.countAllReciclopointsGenerated(
        dates.initial,
        dates.final,
      );
    const totalPurchased = await this.statisticsService.countAllRedeemedCoupons(
      dates.initial,
      dates.final,
    );
    const totalUtilized = await this.statisticsService.countAllUtilizedCoupons(
      dates.initial,
      dates.final,
    );
    const totalUsers = await this.statisticsService.countAllUsers(
      dates.initial,
      dates.final,
    );
    const totalPartners = await this.statisticsService.countAllActiveParners();

    const totalEcopoints =
      await this.statisticsService.countAllActiveEcopoints();
    return ResponseFactoryModule.generate<FieldCountDto[]>([
      {
        campo: 'Total de Reciclopontos gerados;',
        total: toalRpts._sum.valorTotal,
      },
      {
        campo: 'Total de cupons resgatados',
        total: totalPurchased,
      },
      {
        campo: 'Total de cupons utilizados',
        total: totalUtilized,
      },
      {
        campo: 'Total Usuários Cadastrados',
        total: totalUsers,
      },
      {
        campo: 'Total de Empresas Ativas',
        total: totalPartners,
      },
      {
        campo: 'Total de Ecopontos Ativos',
        total: totalEcopoints,
      },
    ]);
  }
}
