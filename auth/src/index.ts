import path from "path";
import createConfig from "./utils/config";
import { logInit, logger } from "./utils/logger";
import EmailSender from "./utils/email-sender";
import NodemailerEmailApi from "./utils/nodemailer-email-api";
import MongoDBConnector from "./database";
import { Channel } from "amqplib";

// ===================== Initialize Config ==========================
const getConfig = () => {
  const currentEnv = process.env.NODE_ENV || "development";
  const configPath =
    currentEnv === "development"
      ? path.join(__dirname, `../configs/.env`)
      : path.join(__dirname, `../configs/.env.${currentEnv}`);
  return createConfig(configPath);
};
export const config = getConfig();
// ==================================================================

// NOTE: NEED TO IMPORT APP UNDER CONFIG SO THAT COULD ACCESS TO VARIABLE ENV
import app from "./app";
import { createQueueConnection } from "./queues/connection";

export let authChannel: Channel;

async function run() {
  try {
    // Activate Logger
    logInit({ env: process.env.NODE_ENV, logLevel: config.logLevel });

    // Activate Email Sender with EmailAPI [NodeMailer]
    const emailSender = EmailSender.getInstance();
    emailSender.activate();
    emailSender.setEmailApi(new NodemailerEmailApi());

    // Activate Database
    const mongodb = MongoDBConnector.getInstance();
    await mongodb.connect({ url: config.mongo.url as string });

    // Activate RabbitMQ
    authChannel = (await createQueueConnection()) as Channel;

    // Start Server
    const server = app.listen(config.port, () => {
      logger.info("Server is listening on port: ", config.port);
    });

    const exitHandler = async () => {
      if (server) {
        server.close(async () => {
          logger.info("server closed!");
          await mongodb.disconnect();
          logger.info("mongodb disconnected!");

          // Gracefully Terminate
          process.exit(1); // terminate the process due to error
        });
      } else {
        await mongodb.disconnect(); // In case the server isn't running but DB needs to be disconnected
        logger.info("MongoDB disconnected.");
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error: unknown) => {
      logger.error("unhandled error", { error });
      exitHandler();
    };

    // Error that might occur duing execution that not caught by any try/catch blocks
    process.on("uncaughtException", unexpectedErrorHandler); // Syncronous
    process.on("unhandledRejection", unexpectedErrorHandler); // Asyncronous

    // A termination signal typically sent from OS or other software (DOCKER, KUBERNETES)
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received");
      if (server) {
        // Stop the server from accepting new request but keeps existing connection open until all ongoin request are done
        server.close();
      }
    });
  } catch (error) {
    logger.error("Failed to initialize application", { error });
    process.exit(1);
  }
}

run();
