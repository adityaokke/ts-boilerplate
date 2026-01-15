import type { AwilixContainer } from 'awilix';
import type { Cradle } from './container.js';
import { stopHttpServer } from './server/http.js';
import { disconnectMongo } from './shared/infrastructure/database/mongodb/connection.js';
import { disconnectRedis } from './shared/infrastructure/cache/redis/connection.js';

export const shutdown = async (
  container: AwilixContainer<Cradle>,
  signal: string,
): Promise<void> => {
  const { logger, streamConsumer } = container.cradle;

  logger.info({ signal }, 'Shutting down');

  await streamConsumer.stop();
  await stopHttpServer(logger);
  await disconnectRedis(logger);
  await disconnectMongo(logger);
  await container.dispose();

  logger.info({}, 'Shutdown complete');
  process.exit(0);
};
