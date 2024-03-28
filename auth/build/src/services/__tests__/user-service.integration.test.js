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
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const user_service_1 = __importDefault(require("../user.service"));
const duplicate_error_1 = __importDefault(require("../../errors/duplicate-error"));
const api_error_1 = __importDefault(require("../../errors/api-error"));
let mongoServer;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    yield mongoose_1.default.connect(mongoUri);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    yield mongoServer.stop();
}));
describe("User Service integration test", () => {
    let userService;
    beforeEach(() => {
        userService = new user_service_1.default();
    });
    it("should return user info & token if success", () => __awaiter(void 0, void 0, void 0, function* () {
        const MOCK_USER = {
            username: "test_user",
            email: "test_user@example.com",
            password: "test_user@1234",
        };
        const newUser = yield userService.SignUp(MOCK_USER);
        expect(newUser).toBeDefined();
        // Expect that newUser has user information
        expect(newUser).toBeDefined();
        expect(newUser.username).toBe(MOCK_USER.username);
        expect(newUser.email).toBe(MOCK_USER.email);
    }));
    it("should throw a duplicate email error if the email already used", () => __awaiter(void 0, void 0, void 0, function* () {
        const MOCK_USER = {
            username: "test_user",
            email: "test_user@example.com",
            password: "test_user@1234",
        };
        yield expect(userService.SignUp(MOCK_USER)).rejects.toThrow(duplicate_error_1.default);
    }));
    it("should throw API error if the username is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const INVALID_MOCK_USER = {
            email: "test_user1@example.com",
            password: "test_user@1234",
        };
        yield expect(userService.SignUp(INVALID_MOCK_USER)).rejects.toThrow(api_error_1.default);
    }));
    it("should throw API error if the email is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const INVALID_MOCK_USER = {
            username: "test_user",
            password: "test_user@1234",
        };
        yield expect(userService.SignUp(INVALID_MOCK_USER)).rejects.toThrow(api_error_1.default);
    }));
    it("should throw API error if the password is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const INVALID_MOCK_USER = {
            username: "test_user",
            email: "test_user1@example.com",
        };
        yield expect(userService.SignUp(INVALID_MOCK_USER)).rejects.toThrow(api_error_1.default);
    }));
});
//# sourceMappingURL=user-service.integration.test.js.map