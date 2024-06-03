"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const beautiful_stringify_1 = __importDefault(require("@auth/utils/beautiful-stringify"));
const logger_1 = require("@auth/utils/logger");
const on_headers_1 = __importDefault(require("on-headers"));
function loggerMiddleware(req, res, _next) {
    const started = new Date().getTime();
    logger_1.logger.debug(`request received: ${(0, beautiful_stringify_1.default)({
        url: req.url,
        method: req.method,
        body: req.body,
    })}`);
    (0, on_headers_1.default)(res, () => {
        logger_1.logger.info(`response sent ${(0, beautiful_stringify_1.default)({
            url: req.url,
            method: req.method,
            statusCode: res.statusCode,
            duration: new Date().getTime() - started,
        })}`);
    });
    _next();
}
exports.default = loggerMiddleware;
//# sourceMappingURL=logger-handler.js.map