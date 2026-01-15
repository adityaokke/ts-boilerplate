import { DomainError } from '@shared/domain/errors/domain-error.js';

export class SampleNotFoundError extends DomainError {
  readonly code = 'SAMPLE_NOT_FOUND';

  constructor(id: string) {
    super(`Sample with id "${id}" not found`);
  }
}

export class SampleAlreadyExistsError extends DomainError {
  readonly code = 'SAMPLE_ALREADY_EXISTS';

  constructor(name: string) {
    super(`Sample with name "${name}" already exists`);
  }
}
