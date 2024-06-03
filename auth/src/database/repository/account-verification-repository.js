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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountVerificationRepository = void 0;
const account_verification_model_1 = __importDefault(require("@auth/database/models/account-verification.model"));
class AccountVerificationRepository {
    CreateVerificationToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, token, }) {
            try {
                const accountVerification = new account_verification_model_1.default({
                    userId,
                    emailVerificationToken: token,
                });
                const newAccountVerification = yield accountVerification.save();
                return newAccountVerification;
            }
            catch (error) {
                throw error;
            }
        });
    }
    FindVerificationToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ token }) {
            try {
                const existedToken = yield account_verification_model_1.default.findOne({
                    emailVerificationToken: token,
                });
                return existedToken;
            }
            catch (error) {
                throw error;
            }
        });
    }
    FindVerificationTokenById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const existedToken = yield account_verification_model_1.default.findOne({
                    userId: id,
                });
                return existedToken;
            }
            catch (error) {
                throw error;
            }
        });
    }
    DeleteVerificationToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ token }) {
            try {
                yield account_verification_model_1.default.deleteOne({
                    emailVerificationToken: token,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AccountVerificationRepository = AccountVerificationRepository;
//# sourceMappingURL=account-verification-repository.js.map