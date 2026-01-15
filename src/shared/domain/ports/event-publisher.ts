import type { DomainEvent } from '@shared/domain/events/domain-event.js';

export type EventPublisher = {
  publish: <T>(event: DomainEvent<T>) => Promise<void>;
};
