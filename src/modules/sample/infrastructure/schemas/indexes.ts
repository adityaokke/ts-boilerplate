import type { Db } from 'mongodb';

export const createSampleIndexes = async (db: Db): Promise<void> => {
  await db.collection('samples').createIndexes([
    { key: { name: 1 }, unique: true },
    { key: { status: 1 } },
    { key: { createdAt: -1 } },
  ]);
};
