import type { Result } from '@shared/common/types/result.js';
import type { Sample } from '../entities/sample.js';

export interface GetSampleInput {
  id: string;
}

export interface GetSample {
  execute(input: GetSampleInput): Promise<Result<Sample, Error>>;
}
