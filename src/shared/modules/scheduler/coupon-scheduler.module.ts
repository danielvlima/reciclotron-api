import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CouponsSchedulerService } from './coupon-scheduler.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CouponsSchedulerService, PrismaService, MailService],
})
export class CouponsSchedulerModule {}