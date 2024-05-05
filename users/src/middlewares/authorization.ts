import APIError from "@users/errors/api-error";
import { StatusCode } from "@users/utils/consts";
import { NextFunction, Request, Response } from "express";

export default function authorization(allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    //@ts-ignore

    console.log('current user: ', req.currentUser)
    //@ts-ignore
    const { role } = req.currentUser;
    const hasAuthorization = allowedRoles.includes(role);

    if (!hasAuthorization) {
      return next(new APIError('You do not have permission to access this resource', StatusCode.Forbidden))
    }

    next();
  }
}