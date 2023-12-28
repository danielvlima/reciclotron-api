import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/shared/modules/code-generator/code-generator.module';
import { ResponseFactoryModule } from 'src/shared/modules/response-factory/response-factory.module';

@Module({
  imports: [CryptoModule, CodeGeneratorModule, ResponseFactoryModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
