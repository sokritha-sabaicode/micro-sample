"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const invalid_input_error_1 = __importDefault(require("../errors/invalid-input-error"));
const validateInput = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return next(new invalid_input_error_1.default(error));
            }
            next(error);
        }
    };
};
exports.default = validateInput;
//# sourceMappingURL=validate-input.js.map