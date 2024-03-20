import dotenv from "dotenv";

function createConfig(configPath: string) {
  dotenv.config({ path: configPath });

  return {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongo: {
      url: process.env.MONGODB_URL,
    },
    logLevel: process.env.LOG_LEVEL,
  };
}

export default createConfig;
