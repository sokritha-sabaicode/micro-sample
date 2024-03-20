import app from "./app";
import createConfig from "./utils/config";
import path from "path";

async function run() {
  const configPath = path.join(__dirname, "../configs/.env");
  const config = createConfig(configPath);

  app.listen(config.port, () => {
    console.log("Server is listening on port: ", config.port);
  });
}

run();
