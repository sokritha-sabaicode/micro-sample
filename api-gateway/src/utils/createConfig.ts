import dotenv from "dotenv";

function createConfig(configPath: string) {
  dotenv.config({ path: configPath });

  // Validate essential configuration
  const requiredConfig = ["NODE_ENV", "AUTH_SERVICE_URL"];
  const missingConfig = requiredConfig.filter((key) => !process.env[key]);

  if (missingConfig.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingConfig.join(", ")}`
    );
  }

  // Return configuration object
  return {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    auth_service_url: process.env.AUTH_SERVICE_URL,
  };
}

export default createConfig;
