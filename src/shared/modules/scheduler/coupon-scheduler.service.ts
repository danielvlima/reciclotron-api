import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CouponsSchedulerService {
  private readonly logger = new Logger(CouponsSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleCron() {

    const users = await this.prisma.usuarios.findMany({
      include: {
        cuponsCompradosUsuario: true,
      },
    });

    for (const user of users) {
      const now = new Date();
      for (const coupon of user.cuponsCompradosUsuario) {
        if (!coupon.utilizadoEm && coupon.expiraEm) {
          const utc1 = Date.UTC(coupon.expiraEm.getFullYear(), coupon.expiraEm.getMonth(), coupon.expiraEm.getDate());
          const utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
          const remaining = Math.ceil((utc2 - utc1) / (1000 * 3600 * 24));

          if(remaining <= 9 && !coupon.notificadoExpiraEm) {
            this.mailerService.sendUserCouponWillExpire(user.email,user.nome,coupon.cupomNome,remaining.toString());

            await this.prisma.cuponsCompradosUsuario.update({
              where: { id: coupon.id },
              data: { notificadoExpiraEm: new Date() },
            });
          }  else if (remaining < 0 && !coupon.notificadoExpiradoEm) {
            await this.mailerService.sendUserCouponExpired(user.email, user.nome, coupon.cupomNome);

            await this.prisma.cuponsCompradosUsuario.update({
              where: { id: coupon.id },
              data: { notificadoExpiradoEm: new Date() },
            });
          }
        }
      }
    }

    const partnerCoupons = await this.prisma.cuponsDesconto.findMany({
      include: {
        empresa: true,
      },
    });

    for(const coupon of partnerCoupons) {
      if(coupon.quantidadeDisponiveis <= 0 && !coupon.notificadoAcabouEm) {
        await this.mailerService.sendPartnerCouponOver(coupon.empresa.email,coupon.nome);

        await this.prisma.cuponsDesconto.update({
          where: { id: coupon.id },
          data: { notificadoAcabouEm: new Date() },
        });
      }
    }
  }
}