import type { AwilixContainer } from 'awilix';
import type { Cradle } from './container.js';
import { createSampleIndexes } from './modules/sample/infrastructure/schemas/indexes.js';
import { startHttpServer } from './server/http.js';

export const bootstrap = async (container: AwilixContainer<Cradle>): Promise<void> => {
  const { app, db, logger, streamConsumer } = container.cradle;

  // Create indexes for all modules
  await createSampleIndexes(db);

  // Start HTTP server
  await startHttpServer(app, logger);

  // Start event stream consumer
  streamConsumer.start();

  logger.info({}, 'Application started');
};
