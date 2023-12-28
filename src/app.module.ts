import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './shared/modules/prisma/prisma.module';
import { CryptoModule } from './shared/modules/crypto/crypto.module';
import { CodeGeneratorModule } from './shared/modules/code-generator/code-generator.module';

@Module({
  imports: [UsersModule, PrismaModule, CryptoModule, CodeGeneratorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
