import type { Sample, SampleStatus } from '../entities/sample.js';

export interface SampleRepository {
  save(sample: Sample): Promise<void>;
  findById(id: string): Promise<Sample | null>;
  findAll(options?: { page?: number; limit?: number }): Promise<Sample[]>;
  count(): Promise<number>;
  findByName(name: string): Promise<Sample | null>;
  updateStatus(id: string, status: SampleStatus): Promise<void>;
  update(sample: Sample): Promise<void>;
  delete(id: string): Promise<void>;
}
