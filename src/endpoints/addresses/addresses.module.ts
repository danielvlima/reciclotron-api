import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { AdminStrategy } from 'src/shared/strategies';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService, AdminStrategy],
  exports: [AddressesService],
})
export class AddressesModule {}
