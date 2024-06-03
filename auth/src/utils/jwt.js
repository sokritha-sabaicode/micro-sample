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
exports.generateSignature = exports.validatePassword = exports.generatePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_error_1 = __importDefault(require("../errors/api-error"));
const server_1 = require("../server");
const config_1 = __importDefault(require("./config"));
const generatePassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = 10;
        return yield bcrypt_1.default.hash(password, salt);
    }
    catch (error) {
        throw new api_error_1.default("Unable to generate password");
    }
});
exports.generatePassword = generatePassword;
const validatePassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ enteredPassword, savedPassword, }) {
    return (yield (0, exports.generatePassword)(enteredPassword)) === savedPassword;
});
exports.validatePassword = validatePassword;
const generateSignature = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield jsonwebtoken_1.default.sign(payload, server_1.privateKey, {
            expiresIn: (0, config_1.default)().jwtExpiresIn,
            algorithm: 'RS256'
        });
    }
    catch (error) {
        console.log(error);
        throw new api_error_1.default("Unable to generate signature from jwt");
    }
});
exports.generateSignature = generateSignature;
//# sourceMappingURL=jwt.js.map