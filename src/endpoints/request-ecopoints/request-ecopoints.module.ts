import { Module } from '@nestjs/common';
import { RequestEcopointsService } from './request-ecopoints.service';
import { RequestEcopointsController } from './request-ecopoints.controller';
import { AdminStrategy } from 'src/shared/strategies';
import { PartnerGuard } from 'src/shared/guards';
import { EcopointsService } from '../ecopoints/ecopoints.service';
import { UsersService } from '../users/users.service';
import { PartnerService } from '../partner/partner.service';

@Module({
  controllers: [RequestEcopointsController],
  providers: [RequestEcopointsService, AdminStrategy, PartnerGuard, EcopointsService, UsersService, PartnerService],
  exports: [RequestEcopointsService],
})
export class RequestEcopointsModule {}
