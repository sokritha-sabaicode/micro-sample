import { logInit, logger } from "./utils/logger";
import MongoDBConnector from "./database";
import getConfig from "@users/utils/config";
import app from "./app";
import path from 'path';
import fs from 'fs';

// READ FILE JWT PUBLIC KEY FIRST!!!!
// Check if the environment variable is set for Docker deployment
const publicKeyPath = process.env.DOCKER_ENV
  ? '/run/secrets/jwt_public_key'  // Path in Docker
  : path.join(__dirname, '../public_key.pem');  // Path in local development


export const publicKey = fs.readFileSync(publicKeyPath, 'utf-8');

async function run() {
  try {
    // Get Config
    const config = getConfig(process.env.NODE_ENV);

    // Activate Logger
    logInit({ env: config.env, logLevel: config.logLevel });

    // Activate Database
    const mongodb = MongoDBConnector.getInstance();
    await mongodb.connect({ url: config.mongoUrl as string });

    // Start Server
    const server = app.listen(config.port, () => {
      logger.info(`Server is listening on port: ${config.port}`);
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
