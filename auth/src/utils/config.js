"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const api_error_1 = __importDefault(require("../errors/api-error"));
const path_1 = __importDefault(require("path"));
function createConfig(configPath) {
    dotenv_1.default.config({ path: configPath });
    // Validate essential configuration
    const requiredConfig = ["NODE_ENV", "PORT", "MONGODB_URL", "LOG_LEVEL", "RABBITMQ_ENDPOINT", "CLIENT_URL", "JWT_EXPIRES_IN", "USER_SERVICE_URL", "COMPANY_SERVICE_URL", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI", "API_GATEWAY_URL"];
    const missingConfig = requiredConfig.filter((key) => !process.env[key]);
    if (missingConfig.length > 0) {
        throw new api_error_1.default(`Missing required environment variables: ${missingConfig.join(", ")}`);
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
const getConfig = (currentEnv = 'development') => {
    const configPath = currentEnv === "development"
        ? path_1.default.join(__dirname, `../../configs/.env`)
        : path_1.default.join(__dirname, `../../configs/.env.${currentEnv}`);
    return createConfig(configPath);
};
exports.default = getConfig;
//# sourceMappingURL=config.js.map