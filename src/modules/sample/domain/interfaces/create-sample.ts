import type { Result } from '@shared/common/types/result.js';

export interface CreateSampleInput {
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateSampleOutput {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
}

export interface CreateSample {
  execute(input: CreateSampleInput): Promise<Result<CreateSampleOutput, Error>>;
}
