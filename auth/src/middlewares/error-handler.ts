import BaseCustomError from "@auth/errors/base-custom-error";
import beautifulStringify from "@auth/utils/beautiful-stringify";
import { StatusCode } from "@auth/utils/consts";
import { logger } from "@auth/utils/logger";
import { NextFunction, Request, Response } from "express";


const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  logger.error(`Auth Service errorHandler() method error: ${beautifulStringify(err)}`)
  // If the error is an instance of our own throw ERROR
  if (err instanceof BaseCustomError) {
    return res.status(err.getStatusCode()).json(err.serializeErrorOutput());
  }

  return res
    .status(StatusCode.InternalServerError)
    .json({ errors: [{ message: "An unexpected error occurred" }] });
};

export { errorHandler };
