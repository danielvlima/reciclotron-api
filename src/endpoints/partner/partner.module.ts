import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/shared/modules/code-generator/code-generator.module';
import {
  AdminStrategy,
  AtStrategy,
  PartnerStrategy,
  RtStrategy,
} from 'src/shared/strategies';

@Module({
  imports: [CryptoModule, CodeGeneratorModule],
  controllers: [PartnerController],
  providers: [
    PartnerService,
    AtStrategy,
    RtStrategy,
    PartnerStrategy,
    AdminStrategy,
  ],
})
export class PartnerModule {}
