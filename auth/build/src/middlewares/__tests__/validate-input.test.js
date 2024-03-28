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
const schema_1 = require("../../schema");
const validate_input_1 = __importDefault(require("../validate-input"));
const invalid_input_error_1 = __importDefault(require("../../errors/invalid-input-error"));
describe("validateInput middleware", () => {
    let res;
    let next;
    beforeAll(() => {
        res = {};
    });
    beforeEach(() => {
        next = jest.fn();
    });
    test("should pass validation and call next() for valid input", () => __awaiter(void 0, void 0, void 0, function* () {
        res = {};
        next = jest.fn();
        const req = {
            body: {
                fullname: "sokritha",
            },
        };
        yield (0, validate_input_1.default)(schema_1.TestSchema)(req, res, next);
        expect(next).toHaveBeenCalledWith(); // Assert that next is called with no arguments
        expect(next).toHaveBeenCalledTimes(1); // Ensure that next is called exactly once
    }));
    test("should call next() with an InvalidInputError for invalid input", () => __awaiter(void 0, void 0, void 0, function* () {
        res = {};
        next = jest.fn();
        const req = {
            body: {
                fullname: "so",
            },
        }; // Provide invalid data for your testSchema
        yield (0, validate_input_1.default)(schema_1.TestSchema)(req, res, next);
        // Expect next to be called with an instance of InvalidInputError
        expect(next).toHaveBeenCalledWith(expect.any(invalid_input_error_1.default));
        expect(next).toHaveBeenCalledTimes(1);
    }));
});
//# sourceMappingURL=validate-input.test.js.map