export * from './repositories/sample-repository.js';

import { vi } from 'vitest';
import type { Logger } from '@shared/domain/interfaces/logger.js';
import type { EventPublisher } from '@shared/domain/interfaces/event-publisher.js';

export const createMockLogger = (): Logger => ({
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  child: vi.fn().mockReturnThis(),
});

export const createMockEventPublisher = (): EventPublisher => ({
  publish: vi.fn(),
});
