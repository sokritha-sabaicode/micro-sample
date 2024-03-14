import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../utils/consts";
import MockCustomError from "../../errors/mock-error";
import { errorHandler } from "../error-handler";

describe("errorHandler middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("handles BaseCustomError correctly", () => {
    const mockError = new MockCustomError("Test error", StatusCode.BadRequest);

    errorHandler(mockError, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(StatusCode.BadRequest);
    expect(res.json).toHaveBeenCalledWith(mockError.serializeErrorOutput());
  });

  it("handles generic errors correctly", () => {
    const mockError = new Error("Generic error");

    errorHandler(mockError, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(StatusCode.InternalServerError);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ message: "An unexpected error occurred" }],
    });
  });
});
