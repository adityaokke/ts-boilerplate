import type { DomainEvent } from '@shared/domain/events/domain-event.js';
import type { SampleCreatedPayload } from '../../../domain/events/sample-created.js';
import type { Logger } from '@shared/domain/ports/logger.js';

export class SampleCreatedHandler {
  constructor(private readonly logger: Logger) {}

  async handle(event: DomainEvent<SampleCreatedPayload>): Promise<void> {
    const log = this.logger.child({ handler: 'SampleCreatedHandler' });

    log.info(
      { sampleId: event.payload.id, name: event.payload.name },
      'Processing sample created event',
    );

    // Add your business logic here, e.g.:
    // - Send notification
    // - Update search index
    // - Sync to external system
    // - Trigger downstream processes

    log.info({ sampleId: event.payload.id }, 'Sample created event processed');
  }
}
