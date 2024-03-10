import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Ecopoint } from 'src/endpoints/ecopoints/entities/ecopoint.entity';
import { DepositMaterialsTransactionDTO } from 'src/endpoints/transactions/dto';

const format = (value: string, pattern: string) => {
  let i = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return pattern.replace(/#/g, (_) => value[i++]);
};

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
    return true;
    return await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }

  async sendSignUp(to: string, isPartner: boolean = false) {
    return await this.sendMail(
      to,
      'Seja bem vindo à plataforma Reciclopontos',
      './sign-up',
      { isPartner },
    );
  }

  async sendGoodbye(to: string, name: string) {
    return await this.sendMail(
      to,
      'Seja bem vindo à plataforma Reciclopontos',
      './goodbye',
      { name },
    );
  }

  async sendForgotPassword(to: string, name: string, code: string) {
    return await this.sendMail(
      to,
      'Seu código de recuperação de senha',
      './forgot-password',
      { name, code },
    );
  }

  async sendPasswordUpdated(to: string, name: string) {
    return await this.sendMail(
      to,
      'Sua senha da plataforma Reciclopontos foi alterada',
      './password-updated',
      { name },
    );
  }

  async sendProfileUpdated(to: string, name: string) {
    return await this.sendMail(
      to,
      'Seu perfil da plataforma Reciclopontos foi atualizado',
      './profile-updated',
      { name },
    );
  }

  async sendUserDepositConfirmed(
    to: string,
    name: string,
    day: string,
    value: string,
  ) {
    return await this.sendMail(
      to,
      'Seu depósito foi confirmado na plataforma Reciclopontos',
      './user/deposit-confirmed',
      { name, day, value },
    );
  }

  async sendUserDepositCancelled(
    to: string,
    name: string,
    day: string,
    value: string,
  ) {
    return await this.sendMail(
      to,
      'Seu depósito foi confirmado na plataforma Reciclopontos',
      './user/deposit-cancelled',
      { name, day, value },
    );
  }

  async sendUserNewPurchase(to: string, name: string, cupomName: string) {
    return await this.sendMail(
      to,
      'Seu cupom foi comprado com sucesso',
      './user/new-purchase',
      { name, cupomName },
    );
  }

  async sendUserNewDeposit(
    to: string,
    name: string,
    total: string,
    materialsDeposit: DepositMaterialsTransactionDTO[],
    ecopoint: Ecopoint,
  ) {
    return await this.sendMail(
      to,
      'Seu depósito foi solicitado com sucesso na plataforma Reciclopontos',
      './user/new-deposit',
      {
        name,
        materials: materialsDeposit.map((el) => {
          return {
            qtd: el.quantidade.toFixed(),
            itemName: el.nomeMaterial,
            pts: el.valorTotal.toFixed(),
          };
        }),
        total,
        ecoId: ecopoint.id,
        ecoName: ecopoint.nome,
        ecoAddress: `${ecopoint.enderecos.rua}, ${ecopoint.enderecos.numero}, ${
          ecopoint.enderecos.bairro
        }, ${ecopoint.enderecos.cidade}-${ecopoint.enderecos.uf};${
          ecopoint.enderecos.complemento
            ? ` Complemento: ${ecopoint.enderecos.complemento};`
            : ''
        } CEP: ${format(ecopoint.enderecos.cep, '#####-###')}`,
      },
    );
  }
}
