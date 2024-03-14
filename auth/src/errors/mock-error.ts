import { SerializedErrorOutput } from "./@types/serialized-error-output";
import BaseCustomError from "./base-custom-error";

export default class MockCustomError extends BaseCustomError {
  private statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

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
