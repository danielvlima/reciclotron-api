import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [MailerModule],
  exports: [MailerModule],
})
export class MailerModule {}
