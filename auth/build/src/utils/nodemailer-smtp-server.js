"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NodemailerSmtpServer {
    constructor() {
        this.host = process.env.SMTP_HOST;
        this.port = parseInt(process.env.SMTP_PORT, 10);
        this.user = process.env.SMTP_APIKEY_PUBLIC;
        this.pass = process.env.SMTP_APIKEY_PRIVATE;
    }
    getConfig() {
        return {
            host: this.host,
            port: this.port,
            auth: {
                user: this.user,
                pass: this.pass,
            },
        };
    }
}
exports.default = NodemailerSmtpServer;
//# sourceMappingURL=nodemailer-smtp-server.js.map