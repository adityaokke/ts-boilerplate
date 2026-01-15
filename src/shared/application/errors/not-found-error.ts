import { ApplicationError } from './application-error.js';

export class NotFoundError extends ApplicationError {
  constructor(resource: string, id?: string) {
    super('NOT_FOUND', `${resource}${id ? ` [${id}]` : ''} not found`, { resource, id });
  }
}
