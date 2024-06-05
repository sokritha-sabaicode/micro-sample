import dotenv from 'dotenv';
import APIError from '../errors/api-error';
import path from 'path'

function createConfig(configPath: string) {
  dotenv.config({ path: configPath });

  // Validate essential configuration
  const requiredConfig = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URL',
    'LOG_LEVEL',
    'RABBITMQ_ENDPOINT',
    'API_GATEWAY',
    'AUTH_SERVICE'
  ];
  const missingConfig = requiredConfig.filter((key) => !process.env[key]);

  if (missingConfig.length > 0) {
    throw new APIError(
      `Missing required environment variables: ${missingConfig.join(', ')}`
    );
  }

  console.log(process.env.NODE_ENV);
  console.log(process.env.API_GATEWAY);
  console.log(process.env.RABBITMQ_ENDPOINT)
  console.log(process.env.AUTH_SERVICE)

  // Return configuration object
  return {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    apiGatewayUrl: process.env.API_GATEWAY,
    logLevel: process.env.LOG_LEVEL,
    rabbitMQ: process.env.RABBITMQ_ENDPOINT,
    mongoUrl: process.env.MONGODB_URL,
    authServiceUrl: process.env.AUTH_SERVICE
  };
}

const getConfig = (currentEnv: string = 'development') => {
  console.log('env log', currentEnv)
  const configPath =
    currentEnv === "development"
      ? path.join(__dirname, `../../configs/.env`)
      : path.join(__dirname, `../../configs/.env.${currentEnv}`);
  return createConfig(configPath);
};

export default getConfig;
