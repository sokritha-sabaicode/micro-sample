import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { config } from "../server";
import APIError from "../errors/api-error";
import { StatusCode } from "../utils/consts";

export const validateToken = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const payload = verify(token, config.jwtToken as string);
    // @ts-ignore
    req.currentUser = payload;
    _next();
  }

  _next(new APIError("User need to be login", StatusCode.Unauthorized));
};
