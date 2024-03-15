import { StatusCode } from "../utils/consts";
import { SerializedErrorOutput } from "./@types/serialized-error-output";
import BaseCustomError from "./base-custom-error";

export default class APIError extends BaseCustomError {
  private statusCode = StatusCode.InternalServerError;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, APIError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serializeErrorOutput(): SerializedErrorOutput {
    return { errors: [{ message: this.message }] };
  }
}
