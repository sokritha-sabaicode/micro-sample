import { SerializedErrorOutput } from "@auth/errors/@types/serialized-error-output";
import BaseCustomError from "@auth/errors/base-custom-error";
import { StatusCode } from "@auth/utils/consts";


export default class DuplicateError extends BaseCustomError {
  constructor(message: string) {
    super(message, StatusCode.Conflict);

    Object.setPrototypeOf(this, DuplicateError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serializeErrorOutput(): SerializedErrorOutput {
    return { errors: [{ message: this.message }] };
  }
}
