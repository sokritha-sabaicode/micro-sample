import { SerializedErrorOutput } from "./@types/serialized-error-output";

export default abstract class BaseCustomError extends Error {
  protected constructor(message?: string) {
    super(message);

    // Allow to chain prototype correctly from Error Class
    Object.setPrototypeOf(this, BaseCustomError.prototype);
  }

  abstract getStatusCode(): number;

  abstract serializeErrorOutput(): SerializedErrorOutput;
}
