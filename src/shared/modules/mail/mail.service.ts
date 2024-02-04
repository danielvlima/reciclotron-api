import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: {
      [name: string]: any;
    },
  ) {
    return await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }

  async sendSignUp(to: string) {
    return await this.sendMail(
      to,
      'Seja bem vindo à plataforma Reciclopontos',
      'user/sign-up',
      {},
    );
  }

  async sendGoodbye(to: string, name: string) {
    return await this.sendMail(
      to,
      'Seja bem vindo à plataforma Reciclopontos',
      'user/goodbye',
      { name },
    );
  }

  async sendForgotPassword(to: string, name: string, code: string) {
    return await this.sendMail(
      to,
      'Seu código de recuperação de senha',
      'user/forgot-password',
      { name, code },
    );
  }

  async sendPasswordUpdated(to: string, name: string) {
    return await this.sendMail(
      to,
      'Sua senha da plataforma Reciclopontos foi alterada',
      'user/password-updated',
      { name },
    );
  }

  async sendProfileUpdated(to: string, name: string) {
    return await this.sendMail(
      to,
      'Seu perfil da plataforma Reciclopontos foi atualizado',
      'user/profile-updated',
      { name },
    );
  }

  async sendUserDepositConfirmed(to: string, name: string, value: string) {
    return await this.sendMail(
      to,
      'Seu depósito foi confirmado na plataforma Reciclopontos',
      'user/deposit-confirmed',
      { name, value },
    );
  }

  async sendUserNewPurchase(
    to: string,
    name: string,
    cupomName: string,
    partnerName: string,
  ) {
    return await this.sendMail(
      to,
      'Seu cupom foi comprado com sucesso',
      'user/new-purchase',
      { name, cupomName, partnerName },
    );
  }
}
