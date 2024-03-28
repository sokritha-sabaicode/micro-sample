"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../utils/consts");
const base_custom_error_1 = __importDefault(require("./base-custom-error"));
class InvalidInputError extends base_custom_error_1.default {
    constructor(errors) {
        super("The input provided is invalid", consts_1.StatusCode.BadRequest);
        this.errors = errors;
        Object.setPrototypeOf(this, InvalidInputError.prototype);
    }
    getStatusCode() {
        return this.statusCode;
    }
    serializeErrorOutput() {
        return { errors: this.errors.errors };
    }
}
exports.default = InvalidInputError;
//# sourceMappingURL=invalid-input-error.js.map