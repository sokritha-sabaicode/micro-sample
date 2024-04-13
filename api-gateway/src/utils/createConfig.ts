import dotenv from "dotenv";
import APIError from "../errors/api-error";

function createConfig(configPath: string) {
  dotenv.config({ path: configPath });

  // Validate essential configuration
  const requiredConfig = [
    "NODE_ENV",
    "AUTH_SERVICE_URL",
    "PORT",
    "CLIENT_URL",
    "LOG_LEVEL",
    "SECRET_KEY_ONE",
    "SECRET_KEY_TWO",
    "JWT_TOKEN",
  ];
  const missingConfig = requiredConfig.filter((key) => !process.env[key]);

  if (missingConfig.length > 0) {
    throw new APIError(
      `Missing required environment variables: ${missingConfig.join(", ")}`
    );
  }

  // Return configuration object
  return {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    auth_service_url: process.env.AUTH_SERVICE_URL,
    client_url: process.env.CLIENT_URL,
    logLevel: process.env.LOG_LEVEL,
    secretKeyOne: process.env.SECRET_KEY_ONE,
    secretKeyTwo: process.env.SECRET_KEY_TWO,
    jwtToken: process.env.JWT_TOKEN,
  };
}

export default createConfig;
