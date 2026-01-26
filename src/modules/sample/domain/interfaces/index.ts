// Use case interfaces
export type { CreateSample, CreateSampleInput, CreateSampleOutput } from './create-sample.js';
export type { GetSample, GetSampleInput } from './get-sample.js';
export type { ListSamples, ListSamplesInput } from './list-samples.js';

// Repository & Client interfaces
export type { SampleRepository } from './sample-repository.js';
export type { SampleClient, SampleClientResponse, SampleClientError } from './sample-client.js';
