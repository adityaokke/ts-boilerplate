import { vi } from 'vitest';
import type { SampleRepositoryPort } from '@modules/sample/domain/ports/outbound/sample-repository.js';

export const createMockSampleRepositoryPort = (): SampleRepositoryPort => ({
  save: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  count: vi.fn(),
  findByName: vi.fn(),
  updateStatus: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});
