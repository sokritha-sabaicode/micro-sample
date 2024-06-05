import { SmtpServer, SmtpServerConfig } from './@types/email-sender.type';
import getConfig from '@notifications/utils/config';

export default class NodemailerSmtpServer implements SmtpServer {
  private host = getConfig(process.env.NODE_ENV).smtpHost;
  private port = parseInt(getConfig(process.env.NODE_ENV).smtpPort!);
  private user = getConfig(process.env.NODE_ENV).senderEmail;
  private pass = getConfig(process.env.NODE_ENV).senderEmailPassword;

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
