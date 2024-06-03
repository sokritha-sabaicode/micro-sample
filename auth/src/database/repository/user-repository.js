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
const user_model_1 = __importDefault(require("@auth/database/models/user.model"));
const api_error_1 = __importDefault(require("@auth/errors/api-error"));
const duplicate_error_1 = __importDefault(require("@auth/errors/duplicate-error"));
const consts_1 = require("@auth/utils/consts");
class UserRepository {
    CreateUser(userDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check for existing user with the same email
                const existingUser = yield this.FindUser({ email: userDetail.email });
                if (existingUser) {
                    throw new duplicate_error_1.default("Email already in use");
                }
                const user = new user_model_1.default(userDetail);
                const userResult = yield user.save();
                return userResult;
            }
            catch (error) {
                console.log("error", error);
                if (error instanceof duplicate_error_1.default) {
                    throw error;
                }
                throw new api_error_1.default("Unable to Create User in Database");
            }
        });
    }
    FindUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email }) {
            try {
                const existingUser = yield user_model_1.default.findOne({ email: email });
                return existingUser;
            }
            catch (error) {
                throw new api_error_1.default("Unable to Find User in Database");
            }
        });
    }
    FindUserById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const existingUser = yield user_model_1.default.findById(id);
                return existingUser;
            }
            catch (error) {
                throw new api_error_1.default("Unable to Find User in Database");
            }
        });
    }
    UpdateUserById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, updates, }) {
            try {
                const isExist = yield this.FindUserById({ id });
                if (!isExist) {
                    throw new api_error_1.default("User does not exist", consts_1.StatusCode.NotFound);
                }
                const newUpdateUser = yield user_model_1.default.findByIdAndUpdate(id, updates, {
                    new: true,
                });
                return newUpdateUser;
            }
            catch (error) {
                if (error instanceof api_error_1.default) {
                    throw error;
                }
                throw new api_error_1.default("Unable to Update User in Database");
            }
        });
    }
}
exports.default = UserRepository;
//# sourceMappingURL=user-repository.js.map