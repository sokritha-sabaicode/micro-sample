import Mail from 'nodemailer/lib/mailer';
import { EmailApi, IEmailLocals } from './@types/email-sender.type';
import nodemailer from 'nodemailer';
import NodemailerSmtpServer from './nodemailer-smtp-server';
import Email from 'email-templates';
import path from 'path';
import { logger } from './logger';
import getConfig from '@notifications/utils/config';

export default class NodemailerEmailApi implements EmailApi {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport(
      new NodemailerSmtpServer().getConfig()
    );
  }

  async sendEmail(
    template: string,
    receiver: string,
    locals: IEmailLocals
  ): Promise<void> {
    try {
      const email: Email = new Email({
        message: {
          from: `Micro Sample <${getConfig(process.env.NODE_ENV).senderEmail}>`,
        },
        send: true,
        preview: false,
        transport: this.transporter,
        views: {
          options: {
            extension: 'ejs',
          },
        },
        juice: true, // use inline css style
        juiceResources: {
          preserveImportant: true,
          webResources: {
            relativeTo: path.join(__dirname, '../../build'),
          },
        },
      });

      await email.send({
        template: path.join(__dirname, '../../src/emails', template),
        message: {
          to: receiver,
        },
        locals: locals,
      });

      logger.info(`Email send successfully.`);
    } catch (error) {
      logger.error(`NotificationService SendMail() method error: ${error}`);
    }
  }
}
