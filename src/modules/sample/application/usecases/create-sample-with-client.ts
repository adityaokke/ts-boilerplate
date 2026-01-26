import { ok, err, type Result } from '@shared/common/types/result.js';
import { Sample } from '../../domain/entities/sample.js';
import type { SampleRepository } from '../../domain/interfaces/sample-repository.js';
import type { SampleClient } from '../../domain/interfaces/sample-client.js';
import type { EventPublisher } from '@shared/domain/interfaces/index.js';
import type { Logger } from '@shared/domain/interfaces/index.js';
import type {
  CreateSample,
  CreateSampleInput,
  CreateSampleOutput,
} from '../../domain/interfaces/create-sample.js';
import { createSampleCreatedEvent } from '../../domain/events/sample-created.js';
import { ValidationError, ConflictError } from '@shared/application/errors/index.js';
import { createSampleSchema } from '../validators/create-sample.js';

/**
 * CreateSampleWithClientImpl
 *
 * Example use case that demonstrates how to use SampleClient
 * to sync data with another service or 3rd party API.
 *
 * Flow:
 * 1. Validate input
 * 2. Check for duplicate name
 * 3. Sync with SampleClient
 * 4. Create sample locally
 * 5. Persist to database
 * 6. Publish domain event
 *
 * Usage:
 * - For payment processing: Replace SampleClient with XenditClient or StripeClient
 * - For inventory sync: Replace with InventoryServiceClient
 * - For notifications: Replace with TwilioClient or SendGridClient
 */
export class CreateSampleWithClientImpl implements CreateSample {
  constructor(
    private readonly sampleRepository: SampleRepository,
    private readonly sampleClient: SampleClient,
    private readonly eventPublisher: EventPublisher,
    private readonly logger: Logger,
  ) {}

  async execute(input: CreateSampleInput): Promise<Result<CreateSampleOutput, Error>> {
    const log = this.logger.child({ usecase: 'CreateSampleWithClient' });

    // 1. Validate input
    const validation = createSampleSchema.safeParse(input);
    if (!validation.success) {
      return err(
        new ValidationError('Invalid input', {
          errors: validation.error.flatten().fieldErrors,
        }),
      );
    }

    const { name, description, metadata } = validation.data;

    // 2. Check for duplicate name
    const existing = await this.sampleRepository.findByName(name);
    if (existing) {
      return err(new ConflictError('Sample with this name already exists', { name }));
    }

    // 3. Sync with SampleClient first
    const clientResult = await this.sampleClient.create({
      name,
      metadata: { description, ...metadata },
    });

    if (!clientResult.ok) {
      log.error(
        { error: clientResult.error, name },
        'Failed to create via SampleClient',
      );
      return err(
        new Error(`SampleClient error: ${clientResult.error.message}`),
      );
    }

    log.info(
      { clientId: clientResult.value.id, name },
      'Created via SampleClient',
    );

    // 4. Create sample locally with client reference
    const sample = Sample.create({
      name,
      description,
      metadata: {
        ...metadata,
        clientId: clientResult.value.id,
        clientStatus: clientResult.value.status,
      },
    });

    // 5. Persist
    await this.sampleRepository.save(sample);

    log.info({ sampleId: sample.id, name }, 'Sample created with client sync');

    // 6. Publish event
    await this.eventPublisher.publish(
      createSampleCreatedEvent({
        id: sample.id,
        name: sample.name,
        status: sample.status,
      }),
    );

    return ok({
      id: sample.id,
      name: sample.name,
      status: sample.status,
      createdAt: sample.createdAt,
    });
  }
}
