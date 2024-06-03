"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/middlewares/validateMiddleware.ts
const invalid_input_error_1 = __importDefault(require("@auth/errors/invalid-input-error"));
const zod_1 = require("zod");
const validateInput = (schema) => {
    return (req, _res, next) => {
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