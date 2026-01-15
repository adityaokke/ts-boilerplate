import type { DomainEvent } from '@shared/domain/events/domain-event.js';

export type SampleArchivedPayload = {
  id: string;
  name: string;
  archivedAt: Date;
};

export const createSampleArchivedEvent = (payload: SampleArchivedPayload): DomainEvent<SampleArchivedPayload> => ({
  type: 'SampleArchived',
  payload,
  occurredAt: new Date(),
});
