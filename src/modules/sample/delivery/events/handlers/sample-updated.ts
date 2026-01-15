import type { DomainEvent } from '@shared/domain/events/domain-event.js';
import type { SampleUpdatedPayload } from '../../../domain/events/sample-updated.js';
import type { Logger } from '@shared/domain/ports/logger.js';

export class SampleUpdatedHandler {
  constructor(private readonly logger: Logger) {}

  async handle(event: DomainEvent<SampleUpdatedPayload>): Promise<void> {
    const log = this.logger.child({ handler: 'SampleUpdatedHandler' });

    log.info(
      {
        sampleId: event.payload.id,
        status: event.payload.status,
        previousStatus: event.payload.previousStatus,
      },
      'Processing sample updated event',
    );

    // Add your business logic here, e.g.:
    // - Update cache
    // - Notify subscribers
    // - Audit log

    log.info({ sampleId: event.payload.id }, 'Sample updated event processed');
  }
}
