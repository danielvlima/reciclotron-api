import { Module } from '@nestjs/common';
import { EcopintsService } from './ecopints.service';
import { EcopintsController } from './ecopints.controller';

@Module({
  controllers: [EcopintsController],
  providers: [EcopintsService],
})
export class EcopintsModule {}
