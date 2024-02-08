import { Module } from '@nestjs/common';
import { RequestEcopointsService } from './request-ecopoints.service';
import { RequestEcopointsController } from './request-ecopoints.controller';
import { AdminStrategy } from 'src/shared/strategies';
import { PartnerGuard } from 'src/shared/guards';

@Module({
  controllers: [RequestEcopointsController],
  providers: [RequestEcopointsService, AdminStrategy, PartnerGuard],
  exports: [RequestEcopointsService],
})
export class RequestEcopointsModule {}
