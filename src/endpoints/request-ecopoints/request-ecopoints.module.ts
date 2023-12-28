import { Module } from '@nestjs/common';
import { RequestEcopointsService } from './request-ecopoints.service';
import { RequestEcopointsController } from './request-ecopoints.controller';

@Module({
  controllers: [RequestEcopointsController],
  providers: [RequestEcopointsService],
})
export class RequestEcopointsModule {}
