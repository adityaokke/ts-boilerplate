import type { Express } from 'express';
import type { Server } from 'http';
import type { Logger } from '@shared/domain/ports/logger.js';
import { config } from '@shared/infrastructure/config/env.js';

let server: Server | null = null;

export const startHttpServer = (app: Express, logger: Logger): Promise<Server> =>
  new Promise((resolve) => {
    server = app.listen(config.http.port, () => {
      logger.info({ port: config.http.port }, 'HTTP server started');
      resolve(server!);
    });
  });

export const stopHttpServer = (logger: Logger): Promise<void> =>
  new Promise((resolve, reject) => {
    if (!server) return resolve();
    server.close((err) => {
      if (err) reject(err);
      else {
        logger.info({}, 'HTTP server stopped');
        server = null;
        resolve();
      }
    });
  });
