import type { Redis } from 'ioredis';
import type { DomainEvent } from '@shared/domain/events/domain-event.js';
import type { EventPublisher } from '@shared/domain/interfaces/index.js';
import type { Logger } from '@shared/domain/interfaces/index.js';
import { config } from '@shared/infrastructure/config/index.js';

export class EventPublisherImpl implements EventPublisher {
  private readonly streamKey = config.stream.key;

  constructor(
    private readonly redis: Redis,
    private readonly logger: Logger,
  ) {}

  async publish<T>(event: DomainEvent<T>): Promise<void> {
    const fields = {
      type: event.type,
      payload: JSON.stringify(event.payload),
      occurredAt: event.occurredAt.toISOString(),
    };

    await this.redis.xadd(this.streamKey, '*', ...Object.entries(fields).flat());
    this.logger.debug({ type: event.type }, 'Event published');
  }

  async publishBatch<T>(events: DomainEvent<T>[]): Promise<void> {
    const pipeline = this.redis.pipeline();

    for (const event of events) {
      const fields = {
        type: event.type,
        payload: JSON.stringify(event.payload),
        occurredAt: event.occurredAt.toISOString(),
      };
      pipeline.xadd(this.streamKey, '*', ...Object.entries(fields).flat());
    }

    await pipeline.exec();
    this.logger.debug({ count: events.length }, 'Events batch published');
  }
}
