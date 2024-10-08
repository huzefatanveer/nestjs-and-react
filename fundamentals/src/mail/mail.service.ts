import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap'; // Import Mailtrap Transport

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Set up the transporter using Mailtrap's Email API
    const TOKEN = process.env.MAILTRAP_TOKEN || 'cfcb017dcdfc8c00bc2e72739debbace'; // Use your Mailtrap token

    this.transporter = nodemailer.createTransport(
      MailtrapTransport({
        token: TOKEN, // Add your Mailtrap token here
        testInboxId: +process.env.MAILTRAP_TEST_INBOX_ID || 3188647, // Replace with your inbox ID
      }),
    );
  }

  // Function to send an email
  async sendEmail(to: string, subject: string, text: string) {
    const sender = {
      address: 'huzefa@gmail.com', // Replace with your sender email address
      name: 'Mailtrap Test', // You can customize the sender name
    };

    const recipients = [to]; // You can pass multiple recipients here

    try {
      // Send the email using the Mailtrap API
      const info = await this.transporter.sendMail({
        from: sender,
        to: recipients,
        subject,
        text,
        category: 'Integration Test', // Optional, use a relevant category
        sandbox: true, // Optional: Set to true for testing purposes
      });

      this.logger.log(`Email sent: ${info.response}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw error;
    }
  }
}
