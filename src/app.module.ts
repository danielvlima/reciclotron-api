import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CryptoModule } from './crypto/crypto.module';
import { CodeGeneratorModule } from './code-generator/code-generator.module';

@Module({
  imports: [UsersModule, PrismaModule, CryptoModule, CodeGeneratorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
