import { NextFunction, Request, Response } from "express";
import APIError from "../errors/api-error";
import { StatusCode } from "../utils/consts";
import { logger } from "../utils/logger";
import { verify } from "jsonwebtoken";
import { config } from "..";

export const verifyUser = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!req.session?.jwt) {
    logger.error(
      "Token is not available. Gateway Service verifyUser() method error"
    );
    throw new APIError(
      "Please login to access this resource.",
      StatusCode.Unauthorized
    );
  }

  try {
    const payload = verify(req.session?.jwt, `${config.jwtToken}`);
    // @ts-ignore
    req.currentUser = payload;
    _next();
  } catch (error) {
    throw new APIError(
      "Token is not available. Please login again.",
      StatusCode.Unauthorized
    );
  }
};

export const checkAuthentication = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // @ts-ignore
  if (!req.currentUser) {
    throw new APIError(
      "Authentication is required to access this route.",
      StatusCode.BadRequest
    );
  }
  _next();
};
