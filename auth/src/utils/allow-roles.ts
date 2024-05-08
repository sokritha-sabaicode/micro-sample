import APIError from "../errors/api-error";
import { StatusCode } from "./consts";

interface IAllowRoles {
  acceptRoles?: string[],
  roleProvided: string
}

export default function allowRoles({ acceptRoles = ["USER", "COMPANY"], roleProvided }: IAllowRoles) {
  if (!acceptRoles.includes(roleProvided)) {
    throw new APIError(`Invalid role specified`, StatusCode.BadRequest)
  }
}