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
const account_verification_model_1 = __importDefault(require("../database/models/account-verification.model"));
const account_verification_repository_1 = require("../database/repository/account-verification-repository");
const user_repository_1 = __importDefault(require("../database/repository/user-repository"));
const api_error_1 = __importDefault(require("../errors/api-error"));
const duplicate_error_1 = __importDefault(require("../errors/duplicate-error"));
const auth_producer_1 = require("../queues/auth.producer");
const server_1 = require("../server");
const account_verification_1 = require("../utils/account-verification");
const consts_1 = require("../utils/consts");
const jwt_1 = require("../utils/jwt");
const logger_1 = require("../utils/logger");
class UserService {
    constructor() {
        this.userRepo = new user_repository_1.default();
        this.accountVerificationRepo = new account_verification_repository_1.AccountVerificationRepository();
    }
    // NOTE: THIS METHOD WILL USE BY SIGNUP WITH EMAIL & OAUTH
    // TODO:
    // 1. Hash The Password If Register With Email
    // 2. Save User to DB
    // 3. If Error, Check Duplication
    // 3.1. Duplication case 1: Sign Up Without Verification
    // 3.2. Duplication case 2: Sign Up With The Same Email
    Create(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1
                const hashedPassword = userDetails.password && (yield (0, jwt_1.generatePassword)(userDetails.password));
                let newUserParams = Object.assign({}, userDetails);
                if (hashedPassword) {
                    newUserParams = Object.assign(Object.assign({}, newUserParams), { password: hashedPassword });
                }
                // Step 2
                const newUser = yield this.userRepo.CreateUser({
                    username: userDetails.username,
                    email: userDetails.email,
                    password: userDetails.password,
                    role: userDetails.role,
                    isVerified: userDetails.isVerified
                });
                return newUser;
            }
            catch (error) {
                // Step 3
                if (error instanceof duplicate_error_1.default) {
                    const existedUser = yield this.userRepo.FindUser({
                        email: userDetails.email,
                    });
                    if (!(existedUser === null || existedUser === void 0 ? void 0 : existedUser.isVerified)) {
                        // Resent the token
                        const token = yield this.accountVerificationRepo.FindVerificationTokenById({ id: existedUser._id.toString() });
                        if (!token) {
                            logger_1.logger.error(`UserService Create() method error: token not found!`);
                            throw new api_error_1.default(`Something went wrong!`, consts_1.StatusCode.InternalServerError);
                        }
                        const messageDetails = {
                            receiverEmail: existedUser.email,
                            verifyLink: `${token.emailVerificationToken}`,
                            template: "verifyEmail",
                        };
                        // Publish To Notification Service
                        yield (0, auth_producer_1.publishDirectMessage)(server_1.authChannel, "email-notification", "auth-email", JSON.stringify(messageDetails), "Verify email message has been sent to notification service");
                        // Throw or handle the error based on your application's needs
                        throw new api_error_1.default("A user with this email already exists. Verification email resent.", consts_1.StatusCode.Conflict);
                    }
                    else {
                        throw new api_error_1.default("A user with this email already exists. Please login.", consts_1.StatusCode.Conflict);
                    }
                }
                throw error;
            }
        });
    }
    // TODO
    // 1. Generate Verify Token
    // 2. Save the Verify Token in the Database
    SaveVerificationToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId }) {
            try {
                // Step 1
                const emailVerificationToken = (0, account_verification_1.generateEmailVerificationToken)();
                // Step 2
                const accountVerification = new account_verification_model_1.default({
                    userId,
                    emailVerificationToken,
                });
                const newAccountVerification = yield accountVerification.save();
                return newAccountVerification;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // TODO
    // 1. Check If Token Query Exist in Collection
    // 2. Find the User Associated With This Token, Ten Update isVerified to True
    // 3. Remove Token from Collection
    VerifyEmailToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ token }) {
            // Step 1.
            const isTokenExist = yield this.accountVerificationRepo.FindVerificationToken({ token });
            if (!isTokenExist) {
                throw new api_error_1.default("Verification token is invalid", consts_1.StatusCode.BadRequest);
            }
            // Step 2.
            const user = yield this.userRepo.FindUserById({
                id: isTokenExist.userId.toString(),
            });
            if (!user) {
                throw new api_error_1.default("User does not exist.", consts_1.StatusCode.NotFound);
            }
            user.isVerified = true;
            yield user.save();
            // Step 3.
            yield this.accountVerificationRepo.DeleteVerificationToken({ token });
            return user;
        });
    }
    Login(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO:
            // 1. Find user by email
            // 2. Validate the password
            // 3. Generate Token & Return
            // Step 1
            const user = yield this.userRepo.FindUser({ email: userDetails.email });
            if (!user) {
                throw new api_error_1.default("User not exist", consts_1.StatusCode.NotFound);
            }
            // Step 2
            const isPwdCorrect = yield (0, jwt_1.validatePassword)({
                enteredPassword: userDetails.password,
                savedPassword: user.password,
            });
            if (!isPwdCorrect) {
                throw new api_error_1.default("Email or Password is incorrect", consts_1.StatusCode.BadRequest);
            }
            // Step 3
            const token = yield (0, jwt_1.generateSignature)({ userId: user._id });
            return token;
        });
    }
    FindUserByEmail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email }) {
            try {
                const user = yield this.userRepo.FindUser({ email });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    UpdateUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, updates }) {
            try {
                const user = yield this.userRepo.FindUserById({ id });
                if (!user) {
                    throw new api_error_1.default("User does not exist", consts_1.StatusCode.NotFound);
                }
                const updatedUser = yield this.userRepo.UpdateUserById({ id, updates });
                return updatedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map