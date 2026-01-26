import { ok, err, type Result } from '@shared/common/types/result.js';
import { Sample } from '../../domain/entities/sample.js';
import type { SampleRepository } from '../../domain/interfaces/sample-repository.js';
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

export class CreateSampleImpl implements CreateSample {
  constructor(
    private readonly sampleRepository: SampleRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly logger: Logger,
  ) {}

  async execute(input: CreateSampleInput): Promise<Result<CreateSampleOutput, Error>> {
    const log = this.logger.child({ usecase: 'CreateSample' });

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

    // 3. Create sample
    const sample = Sample.create({ name, description, metadata });

    // 4. Persist
    await this.sampleRepository.save(sample);

    log.info({ sampleId: sample.id, name }, 'Sample created');

    // 5. Publish event
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
