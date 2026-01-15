import type { CreateSample } from '../../domain/ports/inbound/create-sample.js';
import type { GetSample } from '../../domain/ports/inbound/get-sample.js';
import type { ListSamples } from '../../domain/ports/inbound/list-samples.js';
import type { Sample } from '../../domain/entities/sample.js';

type GrpcCallback<T> = (err: Error | null, response?: T) => void;

type CreateSampleRequest = {
  name: string;
  description?: string;
};

type GetSampleRequest = {
  id: string;
};

type ListSamplesRequest = {
  page: number;
  limit: number;
};

type SampleResponse = {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type ListSamplesResponse = {
  data: SampleResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
};

export const createSampleGrpcHandler = (
  createSampleUseCase: CreateSample,
  getSampleUseCase: GetSample,
  listSamplesUseCase: ListSamples,
) => ({
  CreateSample: async (
    call: { request: CreateSampleRequest },
    callback: GrpcCallback<SampleResponse>,
  ) => {
    const result = await createSampleUseCase.execute(call.request);
    if (!result.ok) {
      callback(result.error);
      return;
    }
    callback(null, {
      id: result.value.id,
      name: result.value.name,
      description: '',
      status: result.value.status,
      created_at: result.value.createdAt.toISOString(),
      updated_at: result.value.createdAt.toISOString(),
    });
  },

  GetSample: async (
    call: { request: GetSampleRequest },
    callback: GrpcCallback<SampleResponse>,
  ) => {
    const result = await getSampleUseCase.execute({ id: call.request.id });
    if (!result.ok) {
      callback(result.error);
      return;
    }
    callback(null, {
      id: result.value.id,
      name: result.value.name,
      description: result.value.description ?? '',
      status: result.value.status,
      created_at: result.value.createdAt.toISOString(),
      updated_at: result.value.updatedAt.toISOString(),
    });
  },

  ListSamples: async (
    call: { request: ListSamplesRequest },
    callback: GrpcCallback<ListSamplesResponse>,
  ) => {
    const result = await listSamplesUseCase.execute({
      page: call.request.page || 1,
      limit: call.request.limit || 20,
    });
    if (!result.ok) {
      callback(result.error);
      return;
    }
    callback(null, {
      data: result.value.data.map((s: Sample) => ({
        id: s.id,
        name: s.name,
        description: s.description ?? '',
        status: s.status,
        created_at: s.createdAt.toISOString(),
        updated_at: s.updatedAt.toISOString(),
      })),
      meta: {
        page: result.value.meta.page,
        limit: result.value.meta.limit,
        total: result.value.meta.total,
        total_pages: result.value.meta.totalPages,
        has_next: result.value.meta.hasNext,
        has_prev: result.value.meta.hasPrev,
      },
    });
  },
});
