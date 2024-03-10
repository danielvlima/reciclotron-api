import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { PartnerStrategy, AdminStrategy } from 'src/shared/strategies';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService, PartnerStrategy, AdminStrategy],
})
export class StatisticsModule {}
