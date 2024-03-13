import { NextFunction, Request, Response } from "express";

describe("errorHandler middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(()=>),
    };
  });
});
