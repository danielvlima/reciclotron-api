import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CryptoModule } from 'src/shared/modules/crypto/crypto.module';
import { CodeGeneratorModule } from 'src/shared/modules/code-generator/code-generator.module';
import {
  AdminStrategy,
  AtStrategy,
  CpfRecoveryStrategy,
  CpfStrategy,
  RtStrategy,
  UserStrategy,
} from 'src/shared/strategies';

@Module({
  imports: [CryptoModule, CodeGeneratorModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    AtStrategy,
    RtStrategy,
    UserStrategy,
    AdminStrategy,
    CpfStrategy,
    CpfRecoveryStrategy,
  ],
  exports: [UsersService],
})
export class UsersModule {}
