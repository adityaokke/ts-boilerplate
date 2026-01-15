export { createSampleCreatedEvent } from './sample-created.js';
export type { SampleCreatedPayload } from './sample-created.js';
export { createSampleUpdatedEvent } from './sample-updated.js';
export type { SampleUpdatedPayload } from './sample-updated.js';
export { createSampleArchivedEvent } from './sample-archived.js';
export type { SampleArchivedPayload } from './sample-archived.js';

export const SAMPLE_EVENTS = {
  CREATED: 'SampleCreated',
  UPDATED: 'SampleUpdated',
  ARCHIVED: 'SampleArchived',
} as const;
