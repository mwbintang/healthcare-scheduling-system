import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailPayload } from 'src/config/mail.config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'localhost',
      port: Number(process.env.MAIL_PORT) || 1025,
      secure: false,
    });
  }

  async sendMail(payload: SendMailPayload) {
    try {
      const { to, subject, text, html } = payload;

      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        text,
        html,
      });

      this.logger.log(`📨 Email sent to ${to}`);
      return info;
    } catch (error) {
      console.error(error);
    }
  }
}
