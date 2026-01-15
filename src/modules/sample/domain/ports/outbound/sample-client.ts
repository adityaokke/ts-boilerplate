import type { Result } from '@shared/common/types/result.js';

/**
 * SampleClientPort
 *
 * Defines the contract for communicating with external services via REST API.
 * The implementation (SampleClient) lives in infrastructure/clients/.
 *
 * Naming convention:
 * - Port (interface): {Name}ClientPort (e.g., XenditClientPort, StripeClientPort)
 * - Implementation: {Name}Client (e.g., XenditClient, StripeClient)
 * - Response type: {Name}ClientResponse
 * - Error type: {Name}ClientError
 */

export interface SampleClientResponse {
  id: string;
  name: string;
  status: string;
  metadata?: Record<string, unknown>;
}

export interface SampleClientError {
  code: string;
  message: string;
  statusCode?: number;
}

export interface SampleClientPort {
  /**
   * Fetch data from external service by ID
   */
  getById(id: string): Promise<Result<SampleClientResponse, SampleClientError>>;

  /**
   * Send data to external service
   */
  create(data: { name: string; metadata?: Record<string, unknown> }): Promise<Result<SampleClientResponse, SampleClientError>>;

  /**
   * Check if external service is healthy
   */
  healthCheck(): Promise<boolean>;
}
