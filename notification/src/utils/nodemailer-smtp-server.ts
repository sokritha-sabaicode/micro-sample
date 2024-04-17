import { SmtpServer, SmtpServerConfig } from './@types/email-sender.type';

export default class NodemailerSmtpServer implements SmtpServer {
  private host = process.env.SMTP_HOST;
  private port = parseInt(process.env.SMTP_PORT!, 10);
  private user = process.env.SENDER_EMAIL;
  private pass = process.env.SENDER_EMAIL_PASSWORD;

  getConfig(): SmtpServerConfig {
    return {
      host: this.host as string,
      port: this.port,
      auth: {
        user: this.user as string,
        pass: this.pass as string,
      },
    };
  }
}
