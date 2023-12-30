import { Module } from '@nestjs/common';
import { EcopointsService } from './ecopoints.service';
import { EcopointsController } from './ecopoints.controller';

@Module({
  controllers: [EcopointsController],
  providers: [EcopointsService],
})
export class EcopointsModule {}
