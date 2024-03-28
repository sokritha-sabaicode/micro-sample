"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmailVerificationToken = void 0;
const crypto_1 = require("crypto");
function generateEmailVerificationToken() {
    return (0, crypto_1.randomBytes)(32).toString("hex");
}
exports.generateEmailVerificationToken = generateEmailVerificationToken;
//# sourceMappingURL=account-verification.js.map