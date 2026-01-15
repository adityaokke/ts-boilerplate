import pino from 'pino';
import type { Logger, LogContext } from '@shared/domain/ports/logger.js';
import { config } from '@shared/infrastructure/config/env.js';

export class PinoLogger implements Logger {
  private readonly logger: pino.Logger;

  constructor(baseLogger?: pino.Logger) {
    this.logger =
      baseLogger ??
      pino({
        level: config.log.level,
        transport: config.isDev
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
      });
  }

  info(context: LogContext, message: string): void {
    this.logger.info(context, message);
  }

  error(context: LogContext, message: string): void {
    this.logger.error(context, message);
  }

  warn(context: LogContext, message: string): void {
    this.logger.warn(context, message);
  }

  debug(context: LogContext, message: string): void {
    this.logger.debug(context, message);
  }

  child(context: LogContext): Logger {
    return new PinoLogger(this.logger.child(context));
  }
}

export const rootLogger = new PinoLogger();
