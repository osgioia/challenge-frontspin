import dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

const requiredEnvVars = ['PORT', 'REDIS_URL', 'DATABASE_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const databaseUrl = new URL(process.env.DATABASE_URL as string);

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  redis: {
    url: process.env.REDIS_URL
  },
  database: {
    type: 'postgres',
    host: databaseUrl.hostname,
    port: parseInt(databaseUrl.port, 10),
    username: databaseUrl.username,
    password: databaseUrl.password,
    database: databaseUrl.pathname.slice(1), 
    synchronize: process.env.NODE_ENV !== 'production', 
    logging: process.env.NODE_ENV !== 'production',
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts']
  } as DataSourceOptions
};