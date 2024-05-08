import { Request, Response, NextFunction } from "express";
import BaseCustomError from "../errors/base-custom-error";
import { StatusCode } from "../utils/consts/status-code";
import beautifulStringify from "../utils/beautiful-stringify";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  console.log(beautifulStringify(err))
  // If the error is an instance of our own throw ERROR
  if (err instanceof BaseCustomError) {
    return res.status(err.getStatusCode()).json(err.serializeErrorOutput());
  }

  return res
    .status(StatusCode.InternalServerError)
    .json({ errors: [{ message: "An unexpected error occurred" }] });
};

export { errorHandler };
