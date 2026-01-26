import type { Db, WithId, Document, Filter } from 'mongodb';
import type { Sample, SampleStatus } from '../../domain/entities/sample.js';
import type { SampleRepository } from '../../domain/interfaces/sample-repository.js';

type SampleDocument = {
  _id: string;
  name: string;
  description?: string;
  status: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

const toDocument = (sample: Sample): SampleDocument => ({
  _id: sample.id,
  name: sample.name,
  description: sample.description,
  status: sample.status,
  metadata: sample.metadata,
  createdAt: sample.createdAt,
  updatedAt: sample.updatedAt,
});

const toEntity = (doc: WithId<Document>): Sample => ({
  id: String(doc._id),
  name: doc.name as string,
  description: doc.description as string | undefined,
  status: doc.status as Sample['status'],
  metadata: doc.metadata as Record<string, unknown> | undefined,
  createdAt: doc.createdAt as Date,
  updatedAt: doc.updatedAt as Date,
});

const byId = (id: string): Filter<Document> => ({ _id: id } as unknown as Filter<Document>);

export class SampleRepositoryImpl implements SampleRepository {
  private readonly collection;

  constructor(private readonly db: Db) {
    this.collection = db.collection('samples');
  }

  async save(sample: Sample): Promise<void> {
    await this.collection.updateOne(byId(sample.id), { $set: toDocument(sample) }, { upsert: true });
  }

  async findById(id: string): Promise<Sample | null> {
    const doc = await this.collection.findOne(byId(id));
    return doc ? toEntity(doc) : null;
  }

  async findAll(options: { page?: number; limit?: number } = {}): Promise<Sample[]> {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const docs = await this.collection
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return docs.map(toEntity);
  }

  async count(): Promise<number> {
    return this.collection.countDocuments({});
  }

  async findByName(name: string): Promise<Sample | null> {
    const doc = await this.collection.findOne({ name });
    return doc ? toEntity(doc) : null;
  }

  async updateStatus(id: string, status: SampleStatus): Promise<void> {
    await this.collection.updateOne(byId(id), { $set: { status, updatedAt: new Date() } });
  }

  async update(sample: Sample): Promise<void> {
    await this.collection.updateOne(byId(sample.id), { $set: toDocument(sample) });
  }

  async delete(id: string): Promise<void> {
    await this.collection.deleteOne(byId(id));
  }
}
