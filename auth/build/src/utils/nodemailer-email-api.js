"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_smtp_server_1 = __importDefault(require("./nodemailer-smtp-server"));
class NodemailerEmailApi {
    constructor() {
        this.buildEmailVerificationLink = (args) => {
            const { emailVerificationToken } = args;
            // TODO: this url will change once we integrate kubernetes in our application
            return `http://localhost:3000/v1/auth/verify/${emailVerificationToken}`;
        };
        this.buildSignUpVerificationEmailTextBody = (args) => {
            const { emailVerificationLink } = args;
            return `Welcome to Micro-sample, the coolest micro sample platform! Please click on the link below (or copy it to your browser) to verify your email address. ${emailVerificationLink}`;
        };
        this.buildSignUpVerificationEmailHtmlBody = (args) => {
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
        this.transporter = nodemailer_1.default.createTransport(new nodemailer_smtp_server_1.default().getConfig());
    }
    sendSignUpVerificationEmail(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { toEmail, emailVerificationToken } = args;
            const emailVerificationLink = this.buildEmailVerificationLink({
                emailVerificationToken,
            });
            const subject = "welcome to micro-sample! Please verify your email address";
            const textBody = this.buildSignUpVerificationEmailTextBody({
                emailVerificationLink,
            });
            const htmlBody = this.buildSignUpVerificationEmailHtmlBody({
                emailVerificationLink,
            });
            yield this.sendEmail({ toEmail, subject, textBody, htmlBody });
            return {
                toEmail,
                status: "success",
            };
        });
    }
    sendEmail(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { toEmail, subject, htmlBody, textBody } = args;
            yield this.transporter.sendMail({
                from: "Micro-sample <noreply@microsample.app>",
                to: toEmail,
                subject,
                text: textBody,
                html: htmlBody,
            });
        });
    }
}
exports.default = NodemailerEmailApi;
//# sourceMappingURL=nodemailer-email-api.js.map