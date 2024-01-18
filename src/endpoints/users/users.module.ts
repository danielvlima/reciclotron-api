import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/shared/modules/code-generator/code-generator.module';
import { AtStrategy, RtStrategy } from 'src/shared/strategies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CryptoModule, CodeGeneratorModule, JwtModule.register({})],
  controllers: [UsersController],
  providers: [UsersService, AtStrategy, RtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
