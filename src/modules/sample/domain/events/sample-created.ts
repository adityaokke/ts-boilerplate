import type { DomainEvent } from '@shared/domain/events/domain-event.js';

export type SampleCreatedPayload = {
  id: string;
  name: string;
  status: string;
};

export const createSampleCreatedEvent = (payload: SampleCreatedPayload): DomainEvent<SampleCreatedPayload> => ({
  type: 'SampleCreated',
  payload,
  occurredAt: new Date(),
});
