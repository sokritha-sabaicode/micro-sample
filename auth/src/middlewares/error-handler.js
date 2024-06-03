"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const base_custom_error_1 = __importDefault(require("@auth/errors/base-custom-error"));
const beautiful_stringify_1 = __importDefault(require("@auth/utils/beautiful-stringify"));
const consts_1 = require("@auth/utils/consts");
const logger_1 = require("@auth/utils/logger");
const errorHandler = (err, _req, res, _next) => {
    logger_1.logger.error(`Auth Service errorHandler() method error: ${(0, beautiful_stringify_1.default)(err)}`);
    // If the error is an instance of our own throw ERROR
    if (err instanceof base_custom_error_1.default) {
        return res.status(err.getStatusCode()).json(err.serializeErrorOutput());
    }
    return res
        .status(consts_1.StatusCode.InternalServerError)
        .json({ errors: [{ message: "An unexpected error occurred" }] });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map