import Mail from 'nodemailer/lib/mailer';
import {
  EmailApi,
  EmailApiSendEmailArgs,
  EmailApiSendEmailResponse,
  EmailApiSendSignUpVerificationEmailArgs,
} from './@types/email-sender.type';
import nodemailer from 'nodemailer';
import NodemailerSmtpServer from './nodemailer-smtp-server';
import Email from 'email-templates';
import { getConfig } from '@notifications/server';
import path from 'path';
import { logger } from './logger';

export type BuildEmailVerificationLinkArgs = {
  emailVerificationToken: string;
};

export type BuildSignUpVerificationEmailArgs = {
  emailVerificationLink: string;
};

export default class NodemailerEmailApi implements EmailApi {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport(
      new NodemailerSmtpServer().getConfig()
    );
  }

  async sendSignUpVerificationEmail(
    args: EmailApiSendSignUpVerificationEmailArgs
  ): Promise<EmailApiSendEmailResponse> {
    const { toEmail, emailVerificationToken } = args;

    const emailVerificationLink = this.buildEmailVerificationLink({
      emailVerificationToken,
    });

    const subject = 'welcome to micro-sample! Please verify your email address';
    const textBody = this.buildSignUpVerificationEmailTextBody({
      emailVerificationLink,
    });
    const htmlBody = this.buildSignUpVerificationEmailHtmlBody({
      emailVerificationLink,
    });

    await this.sendEmail({ toEmail, subject, textBody, htmlBody });

    return {
      toEmail,
      status: 'success',
    };
  }

  private buildEmailVerificationLink = (
    args: BuildEmailVerificationLinkArgs
  ): string => {
    const { emailVerificationToken } = args;

    // TODO: this url will change once we integrate kubernetes in our application
    return `http://localhost:3000/v1/auth/verify?token=${emailVerificationToken}`;
  };

  private buildSignUpVerificationEmailTextBody = (
    args: BuildSignUpVerificationEmailArgs
  ): string => {
    const { emailVerificationLink } = args;

    return `Welcome to Micro-sample, the coolest micro sample platform! Please click on the link below (or copy it to your browser) to verify your email address. ${emailVerificationLink}`;
  };

  private buildSignUpVerificationEmailHtmlBody = (
    args: BuildSignUpVerificationEmailArgs
  ): string => {
    const { emailVerificationLink } = args;

    return `
        <h1>Welcome to Micro-sample</h1>
        <br/>
        Welcome to Micro-sample, the coolest micro sample platform!
        <br/>
        <br/>
        Please click on the link below (or copy it to your browser) to verify your email address:
        <br/>
        <br/>
        <a href="${emailVerificationLink}">${emailVerificationLink}</a>`;
  };

  private async sendEmail(
    template: string,
    receiver: string,
    locals: EmailApiSendEmailArgs
  ): Promise<void> {
    try {
      const email: Email = new Email({
        message: {
          from: `Micro Sample <${getConfig().senderEmail}>`,
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
        template: path.join(__dirname, '../..', 'src/emails', template),
        message: {
          to: receiver,
        },
        locals: locals,
      });

      logger.info(`Email send successfully.`);
    } catch (error) {
      logger.error(`NotificationService SendMail() method error: ${error}`);
    }
    // const { toEmail, subject, htmlBody, textBody } = args;
    // await this.transporter.sendMail({
    //   from: 'Micro Sample <noreply@microsample.app>',
    //   to: toEmail,
    //   subject,
    //   text: textBody,
    //   html: htmlBody,
    // });
  }
}
