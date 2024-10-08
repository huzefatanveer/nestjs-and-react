import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: +process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'huzefatanvirici@bottomtier.com', // Replace with your email
      to,
      subject,
      text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.response}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw error; // Optional: rethrow the error or handle it as needed
    }
  }
}
