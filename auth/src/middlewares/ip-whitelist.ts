import { NextFunction, Request, Response } from "express";
import APIError from "../errors/api-error";
import { StatusCode } from "../utils/consts";

function ipWhitelist(allowedIp: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (allowedIp.includes(req.ip!)) {
      return next();
    }
    next(new APIError('Access Denied', StatusCode.Forbidden))
  }
}

export default ipWhitelist