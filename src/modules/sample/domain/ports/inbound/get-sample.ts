import type { Result } from '@shared/common/types/result.js';
import type { Sample } from '../../entities/sample.js';

export type GetSampleInput = {
  id: string;
};

export type GetSample = {
  execute: (input: GetSampleInput) => Promise<Result<Sample, Error>>;
};
