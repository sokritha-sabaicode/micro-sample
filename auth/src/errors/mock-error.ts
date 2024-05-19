import { SerializedErrorOutput } from "@auth/errors/@types/serialized-error-output";
import BaseCustomError from "@auth/errors/base-custom-error";

export default class MockCustomError extends BaseCustomError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);

    Object.setPrototypeOf(this, MockCustomError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serializeErrorOutput(): SerializedErrorOutput {
    return {
      errors: [{ message: this.message }],
    };
  }
}
