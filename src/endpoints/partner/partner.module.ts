import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/shared/modules/code-generator/code-generator.module';
import { AtStrategy, RtStrategy } from 'src/shared/strategies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CryptoModule, CodeGeneratorModule, JwtModule.register({})],
  controllers: [PartnerController],
  providers: [PartnerService, AtStrategy, RtStrategy],
})
export class PartnerModule {}
