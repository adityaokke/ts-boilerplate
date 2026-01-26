// Public API - what other modules can import from this module
// When extracting to microservice, these exports become the API contract

// Domain exports
export { Sample, SampleStatus } from './domain/entities/sample.js';
export type { SampleRepository } from './domain/interfaces/sample-repository.js';
export type {
  CreateSample,
  CreateSampleInput,
  CreateSampleOutput,
} from './domain/interfaces/create-sample.js';
export type { GetSample, GetSampleInput } from './domain/interfaces/get-sample.js';
export type { ListSamples, ListSamplesInput } from './domain/interfaces/list-samples.js';
export { SAMPLE_EVENTS } from './domain/events/index.js';
export type { SampleCreatedPayload } from './domain/events/sample-created.js';
export type { SampleUpdatedPayload } from './domain/events/sample-updated.js';
export type { SampleArchivedPayload } from './domain/events/sample-archived.js';

// Application exports (use cases)
export { CreateSampleImpl } from './application/usecases/create-sample.js';
export { CreateSampleWithClientImpl } from './application/usecases/create-sample-with-client.js';
export { GetSampleImpl } from './application/usecases/get-sample.js';
export { ListSamplesImpl } from './application/usecases/list-samples.js';

// Infrastructure exports
export { SampleRepositoryImpl } from './infrastructure/repositories/sample-repository.js';
export { createSampleIndexes } from './infrastructure/schemas/indexes.js';
export { SampleClientImpl } from './infrastructure/clients/sample-client.js';
export type {
  SampleClient,
  SampleClientResponse,
  SampleClientError,
} from './domain/interfaces/sample-client.js';

// Delivery exports
export { SampleController } from './delivery/http/controller.js';
export { createSampleRoutes } from './delivery/http/routes.js';
export { createSampleResolvers } from './delivery/graphql/resolvers.js';
export { createSampleGrpcHandler } from './delivery/grpc/handler.js';
export { SampleCreatedHandler } from './delivery/events/handlers/sample-created.js';
export { SampleUpdatedHandler } from './delivery/events/handlers/sample-updated.js';
