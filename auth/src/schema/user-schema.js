"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSignInSchema = exports.UserSignUpSchema = void 0;
const zod_1 = require("zod");
exports.UserSignUpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
    username: zod_1.z.string().min(1, "Full name is required"),
    role: zod_1.z.enum(["USER", "COMPANY"])
});
exports.UserSignInSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
});
//# sourceMappingURL=user-schema.js.map