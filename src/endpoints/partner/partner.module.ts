import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/shared/modules/code-generator/code-generator.module';

@Module({
  imports: [CryptoModule, CodeGeneratorModule],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}
