import app from "./app";
import path = require("path");
import createConfig from "./utils/createConfig";
import { logger } from "./utils/logger";

export const config = (() => {
  const currentEnv = process.env.NODE_ENV || "development";
  const configPath =
    currentEnv === "development"
      ? path.join(__dirname, `../configs/.env`)
      : path.join(__dirname, `../configs/.env.${currentEnv}`);
  return createConfig(configPath);
})();

async function run() {
  try {
    // Start Server
    const server = app.listen(config.port, () => {
      logger.info("Server is listening on port: ", config.port);
    });

    const exitHandler = async () => {
      if (server) {
        server.close(async () => {
          logger.info("server closed!");
          logger.info("mongodb disconnected!");

          // Gracefully Terminate
          process.exit(1); // terminate the process due to error
        });
      } else {
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
  } catch (error) {}
}

run();
