import { MongoClient, type Db } from 'mongodb';
import { config } from '@shared/infrastructure/config/index.js';
import type { Logger } from '@shared/domain/interfaces/index.js';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectMongo = async (logger: Logger): Promise<Db> => {
  if (db) return db;
  logger.info({ uri: config.mongo.uri }, 'Connecting to MongoDB');
  client = new MongoClient(config.mongo.uri);
  await client.connect();
  db = client.db(config.mongo.dbName);
  logger.info({ dbName: config.mongo.dbName }, 'Connected to MongoDB');
  return db;
};

export const disconnectMongo = async (logger: Logger): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    logger.info({}, 'Disconnected from MongoDB');
  }
};

export const checkMongoHealth = async (): Promise<boolean> => {
  try {
    if (!client) return false;
    await client.db().admin().ping();
    return true;
  } catch {
    return false;
  }
};
