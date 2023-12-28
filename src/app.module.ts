import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './endpoints/users/users.module';
import { PrismaModule } from './shared/modules/prisma/prisma.module';
import { CryptoModule } from './shared/modules/crypto/crypto.module';
import { CodeGeneratorModule } from './shared/modules/code-generator/code-generator.module';
import { ResponseFactoryModule } from './shared/modules/response-factory/response-factory.module';
import { PartnerModule } from './endpoints/partner/partner.module';
import { CouponsPurchasedModule } from './endpoints/coupons-purchased/coupons-purchased.module';
import { MaterialsModule } from './endpoints/materials/materials.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    CryptoModule,
    CodeGeneratorModule,
    ResponseFactoryModule,
    PartnerModule,
    CouponsPurchasedModule,
    MaterialsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
