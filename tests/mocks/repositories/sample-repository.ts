import { vi } from 'vitest';
import type { SampleRepository } from '@modules/sample/domain/interfaces/sample-repository.js';

export const createMockSampleRepository = (): SampleRepository => ({
  save: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  count: vi.fn(),
  findByName: vi.fn(),
  updateStatus: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});
