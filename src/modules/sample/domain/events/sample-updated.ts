import type { DomainEvent } from '@shared/domain/events/domain-event.js';

export type SampleUpdatedPayload = {
  id: string;
  name: string;
  status: string;
  previousStatus?: string;
};

export const createSampleUpdatedEvent = (payload: SampleUpdatedPayload): DomainEvent<SampleUpdatedPayload> => ({
  type: 'SampleUpdated',
  payload,
  occurredAt: new Date(),
});
