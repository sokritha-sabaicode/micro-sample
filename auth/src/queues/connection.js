"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnection = exports.createQueueConnection = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const logger_1 = require("../utils/logger");
const config_1 = __importDefault(require("../utils/config"));
function createQueueConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const config = (0, config_1.default)(process.env.NODE_ENV);
            const connection = yield amqplib_1.default.connect(`${config.rabbitMQ}`);
            const channel = yield connection.createChannel();
            logger_1.logger.info("Auth Server connected to queue successfully...");
            closeConnection(channel, connection);
            return channel;
        }
        catch (error) {
            logger_1.logger.error(`Auth Server error createQueueConnection() method: ${error}`);
            return undefined;
        }
    });
}
exports.createQueueConnection = createQueueConnection;
function closeConnection(channel, connection) {
    return __awaiter(this, void 0, void 0, function* () {
        process.once("SIGINT", () => __awaiter(this, void 0, void 0, function* () {
            yield channel.close();
            yield connection.close();
        }));
    });
}
exports.closeConnection = closeConnection;
//# sourceMappingURL=connection.js.map