"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_custom_error_1 = __importDefault(require("@auth/errors/base-custom-error"));
const consts_1 = require("@auth/utils/consts");
class DuplicateError extends base_custom_error_1.default {
    constructor(message) {
        super(message, consts_1.StatusCode.Conflict);
        Object.setPrototypeOf(this, DuplicateError.prototype);
    }
    getStatusCode() {
        return this.statusCode;
    }
    serializeErrorOutput() {
        return { errors: [{ message: this.message }] };
    }
}
exports.default = DuplicateError;
//# sourceMappingURL=duplicate-error.js.map