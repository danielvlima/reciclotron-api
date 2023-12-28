import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/code-generator/code-generator.module';

@Module({
  imports: [CryptoModule, CodeGeneratorModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
