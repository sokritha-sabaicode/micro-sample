"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.AuthController = void 0;
const api_error_1 = __importDefault(require("@auth/errors/api-error"));
const validate_input_1 = __importDefault(require("@auth/middlewares/validate-input"));
const auth_producer_1 = require("@auth/queues/auth.producer");
const route_defs_1 = require("@auth/routes/v1/route-defs");
const schema_1 = require("@auth/schema");
const server_1 = require("@auth/server");
const user_service_1 = __importDefault(require("@auth/services/user.service"));
const allow_roles_1 = __importDefault(require("@auth/utils/allow-roles"));
const config_1 = __importDefault(require("@auth/utils/config"));
const consts_1 = require("@auth/utils/consts");
const jwt_1 = require("@auth/utils/jwt");
const logger_1 = require("@auth/utils/logger");
const axios_1 = __importDefault(require("axios"));
const tsoa_1 = require("tsoa");
let AuthController = class AuthController {
    // TODO:
    // 1. Save User
    // 2. Generate Verification Token & Save to its DB
    // 2. Publish User Detail to Notification Service
    SignUpWithEmail(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password, role } = requestBody;
                // Step 1.
                const userService = new user_service_1.default();
                const newUser = yield userService.Create({ username: username, email: email, password, role: role });
                // Step 2.
                const verificationToken = yield userService.SaveVerificationToken({ userId: newUser._id });
                const messageDetails = {
                    receiverEmail: newUser.email,
                    verifyLink: `${verificationToken.emailVerificationToken}`,
                    template: "verifyEmail",
                };
                // Publish To Notification Service
                yield (0, auth_producer_1.publishDirectMessage)(server_1.authChannel, "microsample-email-notification", "auth-email", JSON.stringify(messageDetails), "Verify email message has been sent to notification service");
                return {
                    message: "Sign up successfully. Please verify your email.",
                    data: newUser,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    // TODO:
    // 1. Verify Token
    // 2. Check Role of User, Publish User Detail to User Service / Company Service
    // 3. Generate JWT
    VerifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userService = new user_service_1.default();
                // Step 1.
                const user = yield userService.VerifyEmailToken({ token });
                // Step 2.
                const userDetail = yield userService.FindUserByEmail({ email: user.email });
                if (!userDetail) {
                    logger_1.logger.error(`AuthController VerifyEmail() method error: user not found`);
                    throw new api_error_1.default(`Something went wrong`, consts_1.StatusCode.InternalServerError);
                }
                let response;
                let data = {
                    authId: userDetail._id,
                    username: userDetail.username,
                    email: userDetail.email,
                    phoneNumber: userDetail.phoneNumber,
                    createdAt: userDetail.createdAt
                };
                if (userDetail.role === 'USER') {
                    response = yield axios_1.default.post(`${(0, config_1.default)().userServiceUrl}/v1/users`, data);
                }
                else { // ROLE: COMPANY
                    response = yield axios_1.default.post(`${(0, config_1.default)().userServiceUrl}/v1/users`, data);
                }
                // Step 3.
                const jwtToken = yield (0, jwt_1.generateSignature)({
                    userId: response.data.data._id,
                    role: userDetail.role
                });
                return { message: 'User verify email successfully', token: jwtToken };
            }
            catch (error) {
                logger_1.logger.error(`AuthService VerifyEmail() method error: ${error}`);
                throw error;
            }
        });
    }
    LoginWithEmail(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = requestBody;
                const userService = new user_service_1.default();
                const jwtToken = yield userService.Login({ email: email, password: password });
                return {
                    message: 'User login successfully',
                    token: jwtToken,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    // TODO:
    // 1. Check if Provide Role is Valid
    // 2. Return the Consent Screen to Client
    GoogleAuth(role) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, allow_roles_1.default)({ roleProvided: role });
            const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${(0, config_1.default)().googleClientId}&redirect_uri=${(0, config_1.default)().googleRedirectUri}&response_type=code&scope=profile email&state=${role}`;
            return { url };
        });
    }
    // TODO:
    // 1. Check if Provide Role is Valid
    // 2. Exchange the code for tokens
    // 3. Fetch User Profile Info by Token
    // 4. Check If User Already Have Account With That Email (User Has Create Account Before Using Email/Password)
    // 4.1 If does, Check if User Have GoogleId
    // 4.1.1 If does, Means User Login With Google Before So Only Generate JWT Token
    // 4.1.2 If not, Need to Add GoogleID and isVerified to true and Generate JWT Token
    // 4.2 If not, It a New User => Create New User & Generate JWT Token
    GoogleAuthCallback(queries) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Queries', queries);
            try {
                // Extract necessary parameters
                const { code, state } = queries;
                if (!code || !state) {
                    throw new Error("'code' and 'state' parameters are required");
                }
                // Step 1.
                (0, allow_roles_1.default)({ roleProvided: state });
                // Step 2.
                const { data } = yield axios_1.default.post("https://oauth2.googleapis.com/token", {
                    clientId: (0, config_1.default)().googleClientId,
                    client_secret: (0, config_1.default)().googleClientSecret,
                    code,
                    redirect_uri: (0, config_1.default)().googleRedirectUri,
                    grant_type: "authorization_code",
                });
                // Step 3.
                const profile = yield axios_1.default.get("https://www.googleapis.com/oauth2/v1/userinfo", {
                    headers: { Authorization: `Bearer ${data.access_token}` },
                });
                // Step 4.
                const userService = new user_service_1.default();
                const existingUser = yield userService.FindUserByEmail({
                    email: profile.data.email,
                });
                // Step 4.1
                if (existingUser) {
                    // Step 4.1.2
                    if (!existingUser.googleId) {
                        yield userService.UpdateUser({
                            id: existingUser._id,
                            updates: { googleId: profile.data.id, isVerified: true },
                        });
                    }
                    // Step 4.1.1 & 4.1.2
                    const jwtToken = yield (0, jwt_1.generateSignature)({
                        userId: existingUser._id,
                        role: state
                    });
                    return {
                        token: jwtToken,
                    };
                }
                // Step 4.2
                const newUser = yield userService.Create({
                    username: profile.data.name,
                    email: profile.data.email,
                    isVerified: true,
                    googleId: profile.data.id,
                    role: state
                });
                const jwtToken = yield (0, jwt_1.generateSignature)({
                    userId: newUser._id,
                    role: state
                });
                return {
                    token: jwtToken,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, tsoa_1.SuccessResponse)(consts_1.StatusCode.Created, "Created"),
    (0, tsoa_1.Post)(route_defs_1.ROUTE_PATHS.AUTH.SIGN_UP),
    (0, tsoa_1.Middlewares)((0, validate_input_1.default)(schema_1.UserSignUpSchema)),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "SignUpWithEmail", null);
__decorate([
    (0, tsoa_1.SuccessResponse)(consts_1.StatusCode.OK, "OK"),
    (0, tsoa_1.Get)(route_defs_1.ROUTE_PATHS.AUTH.VERIFY),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "VerifyEmail", null);
__decorate([
    (0, tsoa_1.SuccessResponse)(consts_1.StatusCode.OK, "OK"),
    (0, tsoa_1.Post)(route_defs_1.ROUTE_PATHS.AUTH.LOGIN),
    (0, tsoa_1.Middlewares)((0, validate_input_1.default)(schema_1.UserSignInSchema)),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "LoginWithEmail", null);
__decorate([
    (0, tsoa_1.SuccessResponse)(consts_1.StatusCode.OK, "OK"),
    (0, tsoa_1.Get)(route_defs_1.ROUTE_PATHS.AUTH.GOOGLE),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "GoogleAuth", null);
__decorate([
    (0, tsoa_1.SuccessResponse)(consts_1.StatusCode.OK, "OK"),
    (0, tsoa_1.Get)(route_defs_1.ROUTE_PATHS.AUTH.GOOGLE_CALLBACK),
    __param(0, (0, tsoa_1.Queries)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "GoogleAuthCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, tsoa_1.Route)("v1/auth")
], AuthController);
//# sourceMappingURL=auth.controller.js.map