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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
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
describe("POST /signup", () => {
    it("should create a new user when provided with valid input", () => __awaiter(void 0, void 0, void 0, function* () {
        const MOCK_USER = {
            username: "test_user",
            email: "test_user@example.com",
            password: "test_user@1234",
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/v1/auth/signup")
            .send(MOCK_USER)
            .expect("Content-Type", /json/)
            .expect(201);
        expect(response.body.username).toBe(MOCK_USER.username);
        expect(response.body.email).toBe(MOCK_USER.email);
    }), 50000);
});
//# sourceMappingURL=auth-router.test.js.map