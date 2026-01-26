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
import { config, type Config } from "./shared/infrastructure/config/index.js";
import { connectMongo } from "./shared/infrastructure/database/index.js";
import { connectRedis, CacheImpl } from "./shared/infrastructure/cache/index.js";
import { EventPublisherImpl, RedisStreamConsumer } from "./shared/infrastructure/messaging/index.js";
import { LoggerImpl } from "./shared/infrastructure/logger/index.js";

// Shared domain interfaces
import type { EventPublisher } from "./shared/domain/interfaces/index.js";
import type { Cache } from "./shared/domain/interfaces/index.js";
import type { Logger } from "./shared/domain/interfaces/index.js";

// Sample module
import {
  SampleRepositoryImpl,
  CreateSampleImpl,
  CreateSampleWithClientImpl,
  GetSampleImpl,
  ListSamplesImpl,
  SampleController,
  SampleCreatedHandler,
  SampleUpdatedHandler,
  SampleClientImpl,
  SAMPLE_EVENTS,
} from "./modules/sample/index.js";
import type {
  SampleRepository,
  SampleCreatedPayload,
  SampleUpdatedPayload,
  SampleClient,
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
  sampleRepository: SampleRepository;
  sampleClient: SampleClient;
  createSampleUseCase: CreateSampleImpl;
  createSampleWithClientUseCase: CreateSampleWithClientImpl;
  getSampleUseCase: GetSampleImpl;
  listSamplesUseCase: ListSamplesImpl;
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
    logger: asClass(LoggerImpl).singleton(),
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
    cache: asClass(CacheImpl).singleton(),
    eventPublisher: asClass(EventPublisherImpl).singleton(),
    streamConsumer: asClass(RedisStreamConsumer).singleton(),
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE: SAMPLE
  // ─────────────────────────────────────────────────────────────────────────────

  // Repositories
  container.register({
    sampleRepository: asClass(SampleRepositoryImpl).singleton(),
  });

  // Clients (external services / 3rd party APIs)
  container.register({
    sampleClient: asClass(SampleClientImpl).singleton(),
  });

  // Use Cases
  container.register({
    createSampleUseCase: asClass(CreateSampleImpl).singleton(),
    createSampleWithClientUseCase: asClass(CreateSampleWithClientImpl).singleton(),
    getSampleUseCase: asClass(GetSampleImpl).singleton(),
    listSamplesUseCase: asClass(ListSamplesImpl).singleton(),
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
