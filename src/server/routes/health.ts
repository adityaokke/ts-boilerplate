import { Router } from 'express';
import { checkMongoHealth } from '@shared/infrastructure/database/index.js';
import { checkRedisHealth } from '@shared/infrastructure/cache/index.js';

export const healthRoutes = (): Router => {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  router.get('/ready', async (_req, res) => {
    const [mongo, redis] = await Promise.all([checkMongoHealth(), checkRedisHealth()]);

    const status = mongo && redis ? 'ready' : 'not_ready';
    const statusCode = mongo && redis ? 200 : 503;

    res.status(statusCode).json({
      status,
      services: { mongo, redis },
      timestamp: new Date().toISOString(),
    });
  });

  return router;
};
