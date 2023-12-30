import { Module } from '@nestjs/common';
import { EcopointsService } from './ecopoints.service';
import { EcopointsController } from './ecopoints.controller';
import { RequestEcopointsService } from '../request-ecopoints/request-ecopoints.service';

@Module({
  controllers: [EcopointsController],
  providers: [EcopointsService, RequestEcopointsService],
})
export class EcopointsModule {}
