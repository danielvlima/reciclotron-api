import { Module } from '@nestjs/common';
import { StaticsService } from './statics.service';
import { StaticsController } from './statics.controller';
import { PartnerStrategy, AdminStrategy } from 'src/shared/strategies';

@Module({
  controllers: [StaticsController],
  providers: [StaticsService, PartnerStrategy, AdminStrategy],
})
export class StaticsModule {}
