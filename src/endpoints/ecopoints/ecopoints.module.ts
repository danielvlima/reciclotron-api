import { Module } from '@nestjs/common';
import { EcopointsService } from './ecopoints.service';
import { EcopointsController } from './ecopoints.controller';
import { RequestEcopointsService } from '../request-ecopoints/request-ecopoints.service';
import {
  UserStrategy,
  AdminStrategy,
  PartnerStrategy,
} from 'src/shared/strategies';

@Module({
  controllers: [EcopointsController],
  providers: [
    EcopointsService,
    RequestEcopointsService,
    UserStrategy,
    AdminStrategy,
    PartnerStrategy,
  ],
  exports: [EcopointsService],
})
export class EcopointsModule {}
