import type { CreateSample } from '../../domain/interfaces/create-sample.js';
import type { GetSample } from '../../domain/interfaces/get-sample.js';
import type { ListSamples } from '../../domain/interfaces/list-samples.js';

export const createSampleResolvers = (
  createSampleUseCase: CreateSample,
  getSampleUseCase: GetSample,
  listSamplesUseCase: ListSamples,
) => ({
  Query: {
    sample: async (_: unknown, { id }: { id: string }) => {
      const result = await getSampleUseCase.execute({ id });
      if (!result.ok) throw result.error;
      return result.value;
    },
    samples: async (_: unknown, { page, limit }: { page?: number; limit?: number }) => {
      const result = await listSamplesUseCase.execute({ page, limit });
      if (!result.ok) throw result.error;
      return result.value;
    },
  },
  Mutation: {
    createSample: async (
      _: unknown,
      { input }: { input: { name: string; description?: string } },
    ) => {
      const result = await createSampleUseCase.execute(input);
      if (!result.ok) throw result.error;
      return result.value;
    },
  },
});
