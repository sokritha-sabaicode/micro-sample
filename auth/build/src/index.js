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
const app_1 = __importDefault(require("./app"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./utils/config"));
const logger_1 = require("./utils/logger");
const email_sender_1 = __importDefault(require("./utils/email-sender"));
const nodemailer_email_api_1 = __importDefault(require("./utils/nodemailer-email-api"));
const database_1 = __importDefault(require("./database"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentEnv = process.env.NODE_ENV || "development";
            const configPath = path_1.default.join(__dirname, currentEnv === "development"
                ? "../configs/.env"
                : currentEnv === "staging"
                    ? "../configs/.env.staging"
                    : "../configs/.env.production");
            const config = (0, config_1.default)(configPath);
            // Activate Logger
            (0, logger_1.logInit)({ env: config.env, logLevel: config.logLevel });
            // Activate Email Sender with EmailAPI [NodeMailer]
            const emailSender = email_sender_1.default.getInstance();
            emailSender.activate();
            emailSender.setEmailApi(new nodemailer_email_api_1.default());
            // Activate Database
            const mongodb = database_1.default.getInstance();
            yield mongodb.connect({ url: config.mongo.url });
            // Start Server
            const server = app_1.default.listen(config.port, () => {
                logger_1.logger.info("Server is listening on port: ", config.port);
            });
            const exitHandler = () => __awaiter(this, void 0, void 0, function* () {
                if (server) {
                    server.close(() => __awaiter(this, void 0, void 0, function* () {
                        logger_1.logger.info("server closed!");
                        yield mongodb.disconnect();
                        logger_1.logger.info("mongodb disconnected!");
                        // Gracefully Terminate
                        process.exit(1); // terminate the process due to error
                    }));
                }
                else {
                    yield mongodb.disconnect(); // In case the server isn't running but DB needs to be disconnected
                    logger_1.logger.info("MongoDB disconnected.");
                    process.exit(1);
                }
            });
            const unexpectedErrorHandler = (error) => {
                logger_1.logger.error("unhandled error", { error });
                exitHandler();
            };
            // Error that might occur duing execution that not caught by any try/catch blocks
            process.on("uncaughtException", unexpectedErrorHandler); // Syncronous
            process.on("unhandledRejection", unexpectedErrorHandler); // Asyncronous
            // A termination signal typically sent from OS or other software (DOCKER, KUBERNETES)
            process.on("SIGTERM", () => {
                logger_1.logger.info("SIGTERM received");
                if (server) {
                    // Stop the server from accepting new request but keeps existing connection open until all ongoin request are done
                    server.close();
                }
            });
        }
        catch (error) {
            logger_1.logger.error("Failed to initialize application", { error });
            process.exit(1);
        }
    });
}
run();
//# sourceMappingURL=index.js.map