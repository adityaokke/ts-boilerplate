import { ok, type Result } from '@shared/common/types/result.js';
import type { Sample } from '../../domain/entities/sample.js';
import type { SampleRepository } from '../../domain/interfaces/sample-repository.js';
import type { ListSamples, ListSamplesInput } from '../../domain/interfaces/list-samples.js';
import type { PaginatedResult } from '@shared/application/dtos/pagination.js';

export class ListSamplesImpl implements ListSamples {
  constructor(private readonly sampleRepository: SampleRepository) {}

  async execute(input: ListSamplesInput): Promise<Result<PaginatedResult<Sample>, Error>> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;

    const [data, total] = await Promise.all([
      this.sampleRepository.findAll({ page, limit }),
      this.sampleRepository.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return ok({
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  }
}
