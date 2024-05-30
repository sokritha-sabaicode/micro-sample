import dotenv from "dotenv";
import APIError from "../errors/api-error";
import path from 'path'

function createConfig(configPath: string) {
  dotenv.config({ path: configPath });

  // Validate essential configuration
  const requiredConfig = ["NODE_ENV", "PORT", "MONGODB_URL", "LOG_LEVEL", "RABBITMQ_ENDPOINT", "CLIENT_URL", "JWT_EXPIRES_IN", "USER_SERVICE_URL", "COMPANY_SERVICE_URL", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI", "API_GATEWAY_URL"];
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
    mongoUrl: process.env.MONGODB_URL,
    logLevel: process.env.LOG_LEVEL,
    rabbitMQ: process.env.RABBITMQ_ENDPOINT,
    clientUrl: process.env.CLIENT_URL,
    apiGateway: process.env.API_GATEWAY_URL,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    userServiceUrl: process.env.USER_SERVICE_URL,
    companyServiceUrl: process.env.COMPANY_SERVICE_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI
  };
}

const getConfig = (currentEnv: string = 'development') => {
  const configPath =
    currentEnv === "development"
      ? path.join(__dirname, `../../configs/.env`)
      : path.join(__dirname, `../../configs/.env.${currentEnv}`);
  return createConfig(configPath);
};

export default getConfig;
