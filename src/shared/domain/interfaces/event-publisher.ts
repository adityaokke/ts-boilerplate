import type { DomainEvent } from '@shared/domain/events/domain-event.js';

export interface EventPublisher {
  publish<T>(event: DomainEvent<T>): Promise<void>;
}
