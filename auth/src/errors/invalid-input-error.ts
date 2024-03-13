import { ZodError } from "zod";
import { StatusCode } from "../utils/consts";
import { SerializedErrorOutput } from "./@types/serialized-error-output";
import BaseCustomError from "./base-custom-error";

export default class InvalidInputError extends BaseCustomError {
  private statusCode = StatusCode.BadRequest;
  private readonly errors: ZodError;

  constructor(errors: ZodError) {
    super("The input provided is invalid");
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
