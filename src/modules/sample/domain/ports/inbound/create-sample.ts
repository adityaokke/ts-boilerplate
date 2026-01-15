import type { Result } from '@shared/common/types/result.js';

export type CreateSampleInput = {
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
};

export type CreateSampleOutput = {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
};

export type CreateSample = {
  execute: (input: CreateSampleInput) => Promise<Result<CreateSampleOutput, Error>>;
};
