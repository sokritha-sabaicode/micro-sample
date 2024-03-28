"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDestroy = exports.logInit = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
// Create a Winston Logger
exports.logger = winston_1.default.createLogger({
    defaultMeta: { service: "auth-service" },
    // Add a timestamp to each log message & format in JSON
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [],
});
const logInit = ({ env, logLevel, }) => {
    console.log("env", env);
    // Output Logs to the Console (Unless it's Testing)
    exports.logger.add(new winston_1.default.transports.Console({
        level: logLevel,
        silent: env === "testing",
    }));
    if (env !== "development") {
        exports.logger.add(new winston_1.default.transports.File({
            level: logLevel,
            filename: path_1.default.join(__dirname, "../../logs/auth-service.log"),
        }));
    }
};
exports.logInit = logInit;
const logDestroy = () => {
    exports.logger.clear();
    exports.logger.close();
};
exports.logDestroy = logDestroy;
//# sourceMappingURL=logger.js.map