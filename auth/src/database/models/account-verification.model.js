"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = __importDefault(require("@auth/errors/api-error"));
const mongoose_1 = __importDefault(require("mongoose"));
const accountVerificationSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    emailVerificationToken: {
        type: String,
        required: true,
        validate: (value) => {
            if (!value || value.length !== 64) {
                throw new api_error_1.default("Invalid email verfication token");
            }
            return true;
        },
    },
});
const AccountVerificationModel = mongoose_1.default.model("Account_Verification", accountVerificationSchema);
exports.default = AccountVerificationModel;
//# sourceMappingURL=account-verification.model.js.map