import { ApplicationError } from './application-error.js';

export class ConflictError extends ApplicationError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('CONFLICT', message, details);
  }
}

export class AlreadyExistsError extends ApplicationError {
  constructor(resource: string, field: string, value: string) {
    super('ALREADY_EXISTS', `${resource} with ${field} "${value}" already exists`, {
      resource,
      field,
      value,
    });
  }
}
