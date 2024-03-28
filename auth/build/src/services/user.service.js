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
const user_repository_1 = __importDefault(require("../database/repository/user-repository"));
const api_error_1 = __importDefault(require("../errors/api-error"));
const account_verification_1 = require("../utils/account-verification");
const email_sender_1 = __importDefault(require("../utils/email-sender"));
const jwt_1 = require("../utils/jwt");
class UserService {
    constructor() {
        this.repository = new user_repository_1.default();
    }
    /**
     * Create a new user with the provided details.
     * Passwords are hashed before storage for security.
     *
     * @param {IUser} userDetails - The details of the user to create.
     * @returns {Promise<UserSignUpResult>} The created user.
     */
    SignUp(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = userDetails;
                // Convert User Password to Hash Password
                const hashedPassword = yield (0, jwt_1.generatePassword)(password);
                // Save User to Database
                const newUser = yield this.repository.CreateUser({
                    username,
                    email,
                    password: hashedPassword,
                });
                // Return Response
                return newUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    SendVerifyEmailToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId }) {
            // TODO
            // 1. Generate Verify Token
            // 2. Save the Verify Token in the Database
            // 3. Get the Info User By Id
            // 4. Send the Email to the User
            try {
                // Step 1
                const emailVerificationToken = (0, account_verification_1.generateEmailVerificationToken)();
                // Step 2
                const accountVerification = new account_verification_model_1.default({
                    userId,
                    emailVerificationToken,
                });
                const newAccountVerification = yield accountVerification.save();
                // Step 3
                const existedUser = yield this.repository.FindUserById({ id: userId });
                if (!existedUser) {
                    throw new api_error_1.default("User does not exist!");
                }
                // Step 4
                const emailSender = email_sender_1.default.getInstance();
                emailSender.sendSignUpVerificationEmail({
                    toEmail: existedUser.email,
                    emailVerificationToken: newAccountVerification.emailVerificationToken,
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map