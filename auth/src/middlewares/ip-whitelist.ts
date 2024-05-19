import APIError from "@auth/errors/api-error";
import { StatusCode } from "@auth/utils/consts";
import { NextFunction, Request, Response } from "express";


function ipWhitelist(allowedIp: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (allowedIp.includes(req.ip!)) {
      return next();
    }
    next(new APIError('Access Denied', StatusCode.Forbidden))
  }
}

export default ipWhitelist