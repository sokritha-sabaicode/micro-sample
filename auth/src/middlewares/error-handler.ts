import { Request, Response, NextFunction } from "express";
import BaseCustomError from "../errors/base-custom-error";
import { StatusCode } from "../utils/consts/status-code";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  console.log(err instanceof BaseCustomError);
  // If the error is an instance of our own throw ERROR
  if (err instanceof BaseCustomError) {
    console.log("Custom error handling");
    return res.status(err.getStatusCode()).json(err.serializeErrorOutput());
  }

  return res
    .status(StatusCode.InternalServerError)
    .json({ errors: [{ message: "An unexpected error occurred" }] });
};

export { errorHandler };
