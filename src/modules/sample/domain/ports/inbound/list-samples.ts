import type { Result } from '@shared/common/types/result.js';
import type { Sample } from '../../entities/sample.js';
import type { PaginatedResult } from '@shared/application/dtos/pagination.js';

export type ListSamplesInput = {
  page?: number;
  limit?: number;
};

export type ListSamples = {
  execute: (input: ListSamplesInput) => Promise<Result<PaginatedResult<Sample>, Error>>;
};
