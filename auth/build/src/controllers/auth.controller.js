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
const user_service_1 = __importDefault(require("../services/user.service"));
const tsoa_1 = require("tsoa");
const validate_input_1 = __importDefault(require("../middlewares/validate-input"));
const schema_1 = require("../schema");
const consts_1 = require("../utils/consts");
let AuthController = class AuthController {
    SignUp(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = requestBody;
                // Save User
                const userService = new user_service_1.default();
                const newUser = yield userService.SignUp({ username, email, password });
                // Send Email Verification
                yield userService.SendVerifyEmailToken({ userId: newUser._id });
                return newUser;
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
    (0, tsoa_1.Post)("/signup"),
    (0, tsoa_1.Middlewares)((0, validate_input_1.default)(schema_1.UserSignUpSchema)),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "SignUp", null);
exports.AuthController = AuthController = __decorate([
    (0, tsoa_1.Route)("v1/auth")
], AuthController);
//# sourceMappingURL=auth.controller.js.map