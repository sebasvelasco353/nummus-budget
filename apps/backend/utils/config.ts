import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const getDatabaseUrl = (): string => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // if we dont receive the database_url variable, we build it based on the other vars 
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = process.env.POSTGRES_PORT || '5432';
  const db = process.env.POSTGRES_DB;

  if (!user || !password || !db) {
    throw new Error(
      'Missing required environment variables. Either set DATABASE_URL or provide POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB'
    );
  }

  return `postgresql://${user}:${password}@${host}:${port}/${db}`;
};


