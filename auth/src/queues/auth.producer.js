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
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishDirectMessage = void 0;
const logger_1 = require("../utils/logger");
const connection_1 = require("./connection");
function publishDirectMessage(channel, exchangeName, routingKey, message, logMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!channel) {
                channel = (yield (0, connection_1.createQueueConnection)());
            }
            yield channel.assertExchange(exchangeName, "direct");
            channel.publish(exchangeName, routingKey, Buffer.from(message));
            logger_1.logger.info(logMessage);
        }
        catch (error) {
            logger_1.logger.error(`AuthService Provider publishDirectMessage() method error`, error);
        }
    });
}
exports.publishDirectMessage = publishDirectMessage;
//# sourceMappingURL=auth.producer.js.map