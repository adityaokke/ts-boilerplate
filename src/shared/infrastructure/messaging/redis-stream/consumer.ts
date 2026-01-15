import type { Redis } from 'ioredis';
import type { Logger } from '@shared/domain/ports/logger.js';
import { config } from '@shared/infrastructure/config/env.js';
import { sleep } from '@shared/common/utils/async.js';

type EventHandler<T = unknown> = (id: string, data: T) => Promise<void>;

export class RedisStreamConsumer {
  private readonly streamKey = config.stream.key;
  private readonly consumerGroup = config.stream.consumerGroup;
  private readonly consumerName = config.stream.consumerName;
  private readonly batchSize = config.stream.batchSize;
  private readonly blockMs = config.stream.blockMs;

  private readonly handlers = new Map<string, EventHandler>();
  private running = false;
  private stopping = false;

  constructor(
    private readonly redis: Redis,
    private readonly logger: Logger,
  ) {}

  registerHandler<T>(eventType: string, handler: EventHandler<T>): void {
    this.handlers.set(eventType, handler as EventHandler);
    this.logger.info({ type: eventType }, 'Handler registered');
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.stopping = false;
    this.logger.info({ group: this.consumerGroup, consumer: this.consumerName }, 'Starting consumer');
    void this.consume();
  }

  async stop(): Promise<void> {
    if (!this.running) return;
    this.stopping = true;
    this.running = false;
    await sleep(100);
    this.logger.info({}, 'Consumer stopped');
  }

  private async ensureConsumerGroup(): Promise<void> {
    try {
      await this.redis.xgroup('CREATE', this.streamKey, this.consumerGroup, '0', 'MKSTREAM');
      this.logger.info({ group: this.consumerGroup }, 'Consumer group created');
    } catch (err) {
      if (!(err instanceof Error && err.message.includes('BUSYGROUP'))) {
        throw err;
      }
    }
  }

  private async processMessage(id: string, fields: string[]): Promise<void> {
    const data: Record<string, string> = {};
    for (let i = 0; i < fields.length; i += 2) {
      data[fields[i]!] = fields[i + 1]!;
    }

    const eventType = data['type'];
    if (!eventType) {
      this.logger.warn({ id }, 'Message missing type');
      await this.redis.xack(this.streamKey, this.consumerGroup, id);
      return;
    }

    const handler = this.handlers.get(eventType);
    if (!handler) {
      this.logger.debug({ id, type: eventType }, 'No handler for event type');
      await this.redis.xack(this.streamKey, this.consumerGroup, id);
      return;
    }

    try {
      const payload = data['payload'] ? JSON.parse(data['payload']) : {};
      await handler(id, payload);
      await this.redis.xack(this.streamKey, this.consumerGroup, id);
      this.logger.debug({ id, type: eventType }, 'Message processed');
    } catch (err) {
      this.logger.error({ id, type: eventType, err: (err as Error).message }, 'Handler error');
    }
  }

  private async consume(): Promise<void> {
    await this.ensureConsumerGroup();

    while (this.running && !this.stopping) {
      try {
        const results = await this.redis.xreadgroup(
          'GROUP',
          this.consumerGroup,
          this.consumerName,
          'COUNT',
          this.batchSize,
          'BLOCK',
          this.blockMs,
          'STREAMS',
          this.streamKey,
          '>',
        );

        if (!results) continue;

        const typedResults = results as Array<[string, Array<[string, string[]]>]>;
        for (const [, messages] of typedResults) {
          for (const [id, fields] of messages) {
            await this.processMessage(id, fields);
          }
        }
      } catch (err) {
        if (!this.stopping) {
          this.logger.error({ err: (err as Error).message }, 'Consumer error');
          await sleep(1000);
        }
      }
    }
  }
}
