import { ok, err, type Result } from '@shared/common/types/result.js';
import type { Sample } from '../../domain/entities/sample.js';
import type { SampleRepositoryPort } from '../../domain/ports/outbound/sample-repository.js';
import type { GetSample, GetSampleInput } from '../../domain/ports/inbound/get-sample.js';
import { NotFoundError } from '@shared/application/errors/index.js';

export class GetSampleUseCase implements GetSample {
  constructor(private readonly sampleRepository: SampleRepositoryPort) {}

  async execute(input: GetSampleInput): Promise<Result<Sample, Error>> {
    const sample = await this.sampleRepository.findById(input.id);
    if (!sample) {
      return err(new NotFoundError('Sample', input.id));
    }
    return ok(sample);
  }
}
