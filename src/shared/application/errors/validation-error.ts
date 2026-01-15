import { ApplicationError } from './application-error.js';

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, details);
  }
}
