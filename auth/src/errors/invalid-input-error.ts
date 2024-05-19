import { SerializedErrorOutput } from "@auth/errors/@types/serialized-error-output";
import BaseCustomError from "@auth/errors/base-custom-error";
import { StatusCode } from "@auth/utils/consts";
import { ZodError } from "zod";


export default class InvalidInputError extends BaseCustomError {
  private readonly errors: ZodError;

  constructor(errors: ZodError) {
    super("The input provided is invalid", StatusCode.BadRequest);
    this.errors = errors;

    Object.setPrototypeOf(this, InvalidInputError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serializeErrorOutput(): SerializedErrorOutput {
    return { errors: this.errors.errors };
  }
}
