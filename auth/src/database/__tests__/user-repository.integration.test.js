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
const user_repository_1 = __importDefault(require("../repository/user-repository"));
const duplicate_error_1 = __importDefault(require("../../errors/duplicate-error"));
const user_model_1 = __importDefault(require("../models/user.model"));
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
describe("UserRepository Integration Tests", () => {
    let userRepository;
    beforeEach(() => {
        userRepository = new user_repository_1.default();
    });
    describe("CreateUser method", () => {
        test("should add a new user to the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const MOCK_USER = {
                username: "test_user",
                email: "test_user@example.com",
                password: "test_user@1234",
            };
            const newUser = yield userRepository.CreateUser(MOCK_USER);
            // Assert
            expect(newUser).toBeDefined();
            expect(newUser.username).toEqual(MOCK_USER.username);
            expect(newUser.email).toEqual(MOCK_USER.email);
            // Check if the user exists in the database
            const foundUser = yield userRepository.FindUserById({ id: newUser._id });
            expect(foundUser).toBeDefined();
            expect(foundUser === null || foundUser === void 0 ? void 0 : foundUser.username).toEqual(MOCK_USER.username);
        }));
        test("should throw DuplicateError if email is already in use", () => __awaiter(void 0, void 0, void 0, function* () {
            const MOCK_EXISTING_USER = {
                username: "test_user",
                email: "test_user@example.com",
                password: "test_user@1234",
            };
            yield expect(userRepository.CreateUser(MOCK_EXISTING_USER)).rejects.toThrow(duplicate_error_1.default);
        }));
        test("should throw APIError when user creation fails", () => __awaiter(void 0, void 0, void 0, function* () {
            const saveMock = jest.spyOn(user_model_1.default.prototype, "save");
            saveMock.mockRejectedValue(new Error("Database error"));
            const MOCK_USER = {
                username: "test_user",
                email: "test_user1@example.com",
                password: "test_user@1234",
            };
            yield expect(userRepository.CreateUser(MOCK_USER)).rejects.toThrow(api_error_1.default);
        }));
    });
});
//# sourceMappingURL=user-repository.integration.test.js.map