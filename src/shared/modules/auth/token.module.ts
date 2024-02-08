import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { CodeGeneratorModule } from '../code-generator/code-generator.module';
import { CryptoModule } from '../crypto/crypto.module';

@Global()
@Module({
  imports: [CryptoModule, CodeGeneratorModule, JwtModule.register({})],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
