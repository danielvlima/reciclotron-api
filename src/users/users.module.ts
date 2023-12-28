import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  imports: [CryptoModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
