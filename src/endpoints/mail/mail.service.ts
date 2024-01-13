import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'your-smtp-host',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'your-smtp-username',
        pass: 'your-smtp-password',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      from: 'your-email@example.com',
      to,
      subject,
      text,
    });

    console.log('Message sent: %s', info.messageId);
  }
}
