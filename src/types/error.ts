export class HttpError extends Error {
  code: number;

  message: string;

  stac?: string;

  constructor(code: number, message: string, stack?: string) {
    super(message);
    this.code = code;
    this.message = message;
    this.stack = stack;
  }
}
