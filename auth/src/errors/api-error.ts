// USE CASE:
// 1. Unexpected Server Error
// 2. Fallback Error Handler
// 3. Generic Server Error

import { SerializedErrorOutput } from "@auth/errors/@types/serialized-error-output";
import BaseCustomError from "@auth/errors/base-custom-error";
import { StatusCode } from "@auth/utils/consts";

export default class APIError extends BaseCustomError {
  constructor(message: string, statusCode: number = StatusCode.InternalServerError) {
    super(message, statusCode);

    Object.setPrototypeOf(this, APIError.prototype);
  }

  getStatusCode(): number { return this.statusCode; }

  serializeErrorOutput(): SerializedErrorOutput {
    return {
      errors: [
        {
          message: this.message
        }
      ]
    };
  }
}
