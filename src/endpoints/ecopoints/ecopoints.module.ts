import { Module } from '@nestjs/common';
import { EcopointsService } from './ecopoints.service';
import { EcopointsController } from './ecopoints.controller';
import { RequestEcopointsService } from '../request-ecopoints/request-ecopoints.service';
import {
  UserStrategy,
  AdminStrategy,
  PartnerStrategy,
} from 'src/shared/strategies';
import { PartnerService } from '../partner/partner.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [EcopointsController],
  providers: [
    EcopointsService,
    PartnerService,
    UsersService,
    RequestEcopointsService,
    UserStrategy,
    AdminStrategy,
    PartnerStrategy,
  ],
  exports: [EcopointsService],
})
export class EcopointsModule {}
