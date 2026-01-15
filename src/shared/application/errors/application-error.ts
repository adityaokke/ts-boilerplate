export class ApplicationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApplicationError';
  }

  toJSON() {
    return { code: this.code, message: this.message, details: this.details };
  }
}
