/**
 * Awilix DI Container - Composition Root
 * Loads shared infrastructure and all modules
 */

import {
  createContainer,
  asClass,
  asValue,
  InjectionMode,
  type AwilixContainer,
} from "awilix";
import type { Express } from "express";
import type { Db } from "mongodb";
import type { Redis } from "ioredis";

// Shared infrastructure
import { config, type Config } from "./shared/infrastructure/config/env.js";
import { connectMongo } from "./shared/infrastructure/database/mongodb/connection.js";
import { connectRedis } from "./shared/infrastructure/cache/redis/connection.js";
import { RedisCache } from "./shared/infrastructure/cache/redis/cache.js";
import { RedisEventPublisher } from "./shared/infrastructure/messaging/redis-stream/publisher.js";
import { RedisStreamConsumer } from "./shared/infrastructure/messaging/redis-stream/consumer.js";
import { PinoLogger } from "./shared/infrastructure/logger/pino.js";

// Shared domain ports
import type { EventPublisher } from "./shared/domain/ports/event-publisher.js";
import type { Cache } from "./shared/domain/ports/cache.js";
import type { Logger } from "./shared/domain/ports/logger.js";

// Sample module
import {
  SampleRepository,
  CreateSampleUseCase,
  CreateSampleWithClientUseCase,
  GetSampleUseCase,
  ListSamplesUseCase,
  SampleController,
  SampleCreatedHandler,
  SampleUpdatedHandler,
  SampleClient,
  SAMPLE_EVENTS,
} from "./modules/sample/index.js";
import type {
  SampleRepositoryPort,
  SampleCreatedPayload,
  SampleUpdatedPayload,
  SampleClientPort,
} from "./modules/sample/index.js";

// Server
import { createExpressApp } from "./server/app.js";
import { healthRoutes } from "./server/routes/health.js";
import { createSampleRoutes } from "./modules/sample/delivery/http/routes.js";
import { errorHandler } from "./server/middlewares/error-handler.js";

export type Cradle = {
  // Config
  config: Config;

  // Shared Infrastructure
  db: Db;
  redis: Redis;
  logger: Logger;
  cache: Cache;
  eventPublisher: EventPublisher;
  streamConsumer: RedisStreamConsumer;

  // Sample Module
  sampleRepository: SampleRepositoryPort;
  sampleClient: SampleClientPort;
  createSampleUseCase: CreateSampleUseCase;
  createSampleWithClientUseCase: CreateSampleWithClientUseCase;
  getSampleUseCase: GetSampleUseCase;
  listSamplesUseCase: ListSamplesUseCase;
  sampleController: SampleController;

  // Express
  app: Express;
};

export const createAppContainer = async (): Promise<
  AwilixContainer<Cradle>
> => {
  const container = createContainer<Cradle>({
    injectionMode: InjectionMode.PROXY,
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // SHARED INFRASTRUCTURE
  // ─────────────────────────────────────────────────────────────────────────────

  // Config
  container.register({
    config: asValue(config),
  });

  // Logger - singleton
  container.register({
    logger: asClass(PinoLogger).singleton(),
  });

  // Infrastructure connections
  const logger = container.resolve("logger");
  const db = await connectMongo(logger);
  const redis = connectRedis(logger);

  container.register({
    db: asValue(db),
    redis: asValue(redis),
  });

  // Infrastructure services - singletons
  container.register({
    cache: asClass(RedisCache).singleton(),
    eventPublisher: asClass(RedisEventPublisher).singleton(),
    streamConsumer: asClass(RedisStreamConsumer).singleton(),
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE: SAMPLE
  // ─────────────────────────────────────────────────────────────────────────────

  // Repositories
  container.register({
    sampleRepository: asClass(SampleRepository).singleton(),
  });

  // Clients (external services / 3rd party APIs)
  container.register({
    sampleClient: asClass(SampleClient).singleton(),
  });

  // Use Cases
  container.register({
    createSampleUseCase: asClass(CreateSampleUseCase).singleton(),
    createSampleWithClientUseCase: asClass(CreateSampleWithClientUseCase).singleton(),
    getSampleUseCase: asClass(GetSampleUseCase).singleton(),
    listSamplesUseCase: asClass(ListSamplesUseCase).singleton(),
  });

  // Controllers
  container.register({
    sampleController: asClass(SampleController).singleton(),
  });

  // Event Handlers
  const sampleCreatedHandler = new SampleCreatedHandler(logger);
  const sampleUpdatedHandler = new SampleUpdatedHandler(logger);
  const { streamConsumer } = container.cradle;

  streamConsumer.registerHandler<SampleCreatedPayload>(
    SAMPLE_EVENTS.CREATED,
    (id, payload) =>
      sampleCreatedHandler.handle({
        type: SAMPLE_EVENTS.CREATED,
        payload,
        occurredAt: new Date(),
      })
  );
  streamConsumer.registerHandler<SampleUpdatedPayload>(
    SAMPLE_EVENTS.UPDATED,
    (id, payload) =>
      sampleUpdatedHandler.handle({
        type: SAMPLE_EVENTS.UPDATED,
        payload,
        occurredAt: new Date(),
      })
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // EXPRESS APP (mounts routes from all modules)
  // ─────────────────────────────────────────────────────────────────────────────

  const { sampleController } = container.cradle;
  const app = createExpressApp();

  // Health routes
  app.use("/api", healthRoutes());

  // Module routes
  app.use("/api", createSampleRoutes(sampleController));

  // Error handler (must be last)
  app.use(errorHandler);

  container.register({
    app: asValue(app),
  });

  return container;
};
