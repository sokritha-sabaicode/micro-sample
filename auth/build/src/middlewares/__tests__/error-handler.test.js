"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../../utils/consts");
const mock_error_1 = __importDefault(require("../../errors/mock-error"));
const error_handler_1 = require("../error-handler");
describe("errorHandler middleware", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });
    it("handles BaseCustomError correctly", () => {
        const mockError = new mock_error_1.default("Test error", consts_1.StatusCode.BadRequest);
        (0, error_handler_1.errorHandler)(mockError, req, res, next);
        expect(res.status).toHaveBeenCalledWith(consts_1.StatusCode.BadRequest);
        expect(res.json).toHaveBeenCalledWith(mockError.serializeErrorOutput());
    });
    it("handles generic errors correctly", () => {
        const mockError = new Error("Generic error");
        (0, error_handler_1.errorHandler)(mockError, req, res, next);
        expect(res.status).toHaveBeenCalledWith(consts_1.StatusCode.InternalServerError);
        expect(res.json).toHaveBeenCalledWith({
            errors: [{ message: "An unexpected error occurred" }],
        });
    });
});
//# sourceMappingURL=error-handler.test.js.map