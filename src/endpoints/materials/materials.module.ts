import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { AdminStrategy, CpfStrategy } from 'src/shared/strategies';

@Module({
  controllers: [MaterialsController],
  providers: [MaterialsService, AdminStrategy, CpfStrategy],
})
export class MaterialsModule {}
