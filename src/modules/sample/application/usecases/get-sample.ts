import { ok, err, type Result } from '@shared/common/types/result.js';
import type { Sample } from '../../domain/entities/sample.js';
import type { SampleRepository } from '../../domain/interfaces/sample-repository.js';
import type { GetSample, GetSampleInput } from '../../domain/interfaces/get-sample.js';
import { NotFoundError } from '@shared/application/errors/index.js';

export class GetSampleImpl implements GetSample {
  constructor(private readonly sampleRepository: SampleRepository) {}

  async execute(input: GetSampleInput): Promise<Result<Sample, Error>> {
    const sample = await this.sampleRepository.findById(input.id);
    if (!sample) {
      return err(new NotFoundError('Sample', input.id));
    }
    return ok(sample);
  }
}
