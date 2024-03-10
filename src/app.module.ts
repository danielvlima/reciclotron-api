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
import { RequestEcopointsModule } from './endpoints/request-ecopoints/request-ecopoints.module';
import { DiscountCouponModule } from './endpoints/discount-coupon/discount-coupon.module';
import { TransactionsModule } from './endpoints/transactions/transactions.module';
import { CompareModule } from './shared/modules/compare/compare.module';
import { EcopointsModule } from './endpoints/ecopoints/ecopoints.module';
import { AddressesModule } from './endpoints/addresses/addresses.module';
import { MailModule } from './shared/modules/mail/mail.module';
import { TokenModule } from './shared/modules/auth/token.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './shared/guards';
import { StatisticsModule } from './endpoints/statistics/statistics.module';
import { PdfModule } from './shared/modules/pdf/pdf.module';

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
    RequestEcopointsModule,
    DiscountCouponModule,
    TransactionsModule,
    CompareModule,
    EcopointsModule,
    AddressesModule,
    TokenModule,
    MailModule,
    StatisticsModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
