import dotenv from 'dotenv';
import APIError from '../errors/api-error';

function createConfig(configPath: string) {
  dotenv.config({ path: configPath });

  // Validate essential configuration
  const requiredConfig = [
    'NODE_ENV',
    'PORT',
    'CLIENT_URL',
    'LOG_LEVEL',
    'RABBITMQ_ENDPOINT',
    'SENDER_EMAIL',
    'SENDER_EMAIL_PASSWORD',
  ];
  const missingConfig = requiredConfig.filter((key) => !process.env[key]);

  if (missingConfig.length > 0) {
    throw new APIError(
      `Missing required environment variables: ${missingConfig.join(', ')}`
    );
  }

  // Return configuration object
  return {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    clientUrl: process.env.CLIENT_URL,
    logLevel: process.env.LOG_LEVEL,
    rabbitMQ: process.env.RABBITMQ_ENDPOINT,
    senderEmail: process.env.SENDER_EMAIL,
    senderEmailPassword: process.env.SENDER_EMAIL_PASSWORD,
  };
}

export default createConfig;
