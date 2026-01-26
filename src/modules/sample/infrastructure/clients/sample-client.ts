import { ok, err, type Result } from '@shared/common/types/result.js';
import type { Config } from '@shared/infrastructure/config/index.js';
import type { Logger } from '@shared/domain/interfaces/index.js';
import type {
  SampleClient,
  SampleClientResponse,
  SampleClientError,
} from '../../domain/interfaces/sample-client.js';

/**
 * SampleClientImpl - HTTP implementation of SampleClient
 *
 * This client handles REST API communication with external services.
 * Replace the baseUrl with your actual external service URL.
 *
 * Naming convention for clients:
 * - Interface: SampleClient
 * - Implementation: SampleClientImpl
 *
 * Usage in use case:
 * ```typescript
 * constructor(
 *   private readonly sampleClient: SampleClient,
 * ) {}
 *
 * async execute(input) {
 *   const result = await this.sampleClient.getById(input.externalId);
 *   if (!result.ok) {
 *     return err(new Error(result.error.message));
 *   }
 *   // use result.value
 * }
 * ```
 */
export class SampleClientImpl implements SampleClient {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
  ) {
    // Configure your sample client URL in .env
    // e.g., SAMPLE_CLIENT_URL=http://other-service:3001
    this.baseUrl = config.sampleClientUrl || 'http://localhost:3001';
    this.timeout = 5000;
  }

  async getById(id: string): Promise<Result<SampleClientResponse, SampleClientError>> {
    const log = this.logger.child({ client: 'SampleClient', method: 'getById' });

    try {
      const response = await fetch(`${this.baseUrl}/api/resources/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Service-Name': 'sample-service',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({})) as Record<string, unknown>;
        log.warn({ id, status: response.status }, 'SampleClient returned error');

        return err({
          code: 'SAMPLE_CLIENT_ERROR',
          message: (errorBody.message as string) || `SampleClient error: ${response.status}`,
          statusCode: response.status,
        });
      }

      const data = (await response.json()) as SampleClientResponse;
      log.info({ id, externalId: data.id }, 'Data fetched from SampleClient');

      return ok(data);
    } catch (error) {
      log.error({ error, id }, 'Failed to fetch from SampleClient');

      if (error instanceof Error && error.name === 'TimeoutError') {
        return err({
          code: 'TIMEOUT',
          message: 'SampleClient request timed out',
        });
      }

      return err({
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown network error',
      });
    }
  }

  async create(data: {
    name: string;
    metadata?: Record<string, unknown>;
  }): Promise<Result<SampleClientResponse, SampleClientError>> {
    const log = this.logger.child({ client: 'SampleClient', method: 'create' });

    try {
      const response = await fetch(`${this.baseUrl}/api/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Service-Name': 'sample-service',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({})) as Record<string, unknown>;
        log.warn({ data, status: response.status }, 'SampleClient create failed');

        return err({
          code: 'SAMPLE_CLIENT_ERROR',
          message: (errorBody.message as string) || `SampleClient error: ${response.status}`,
          statusCode: response.status,
        });
      }

      const result = (await response.json()) as SampleClientResponse;
      log.info({ externalId: result.id, name: result.name }, 'Data created via SampleClient');

      return ok(result);
    } catch (error) {
      log.error({ error, data }, 'Failed to create via SampleClient');

      if (error instanceof Error && error.name === 'TimeoutError') {
        return err({
          code: 'TIMEOUT',
          message: 'SampleClient request timed out',
        });
      }

      return err({
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown network error',
      });
    }
  }

  async healthCheck(): Promise<boolean> {
    const log = this.logger.child({ client: 'SampleClient', method: 'healthCheck' });

    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000),
      });

      const isHealthy = response.ok;
      log.debug({ isHealthy }, 'SampleClient health check');

      return isHealthy;
    } catch (error) {
      log.warn({ error }, 'SampleClient health check failed');
      return false;
    }
  }
}
