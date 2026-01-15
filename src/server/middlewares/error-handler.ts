import type { ErrorRequestHandler } from 'express';
import { ApplicationError } from '@shared/application/errors/application-error.js';
import { DomainError } from '@shared/domain/errors/domain-error.js';

const errorToStatus: Record<string, number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  ALREADY_EXISTS: 409,
  CONFLICT: 409,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INVALID_TRANSITION: 400,
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApplicationError) {
    const status = errorToStatus[err.code] ?? 500;
    res.status(status).json(err.toJSON());
    return;
  }

  if (err instanceof DomainError) {
    const status = errorToStatus[err.code] ?? 400;
    res.status(status).json({ code: err.code, message: err.message });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
};
