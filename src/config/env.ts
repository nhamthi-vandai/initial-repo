import { FastifyInstance } from 'fastify';

export const envSchema = {
  type: 'object',
  required: ['PORT', 'DATABASE_URL'],
  properties: {
    NODE_ENV: {
      type: 'string',
      default: 'development',
    },
    PORT: {
      type: 'integer',
      default: 3000,
    },
    HOST: {
      type: 'string',
      default: '0.0.0.0',
    },
    LOG_LEVEL: {
      type: 'string',
      default: 'info',
    },
    DATABASE_URL: {
      type: 'string',
    },
    DB_HOST: {
      type: 'string',
      default: 'localhost',
    },
    DB_PORT: {
      type: 'integer',
      default: 5432,
    },
    DB_NAME: {
      type: 'string',
      default: 'fastify_db',
    },
    DB_USER: {
      type: 'string',
      default: 'postgres',
    },
    DB_PASSWORD: {
      type: 'string',
      default: 'postgres',
    },
    CORS_ORIGIN: {
      type: 'string',
      default: '*',
    },
    RATE_LIMIT_MAX: {
      type: 'integer',
      default: 100,
    },
    RATE_LIMIT_TIMEWINDOW: {
      type: 'integer',
      default: 60000,
    },
  },
};

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      NODE_ENV: string;
      PORT: number;
      HOST: string;
      LOG_LEVEL: string;
      DATABASE_URL: string;
      DB_HOST: string;
      DB_PORT: number;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
      CORS_ORIGIN: string;
      RATE_LIMIT_MAX: number;
      RATE_LIMIT_TIMEWINDOW: number;
    };
  }
}

export async function registerEnv(app: FastifyInstance): Promise<void> {
  await app.register(import('@fastify/env'), {
    schema: envSchema,
    dotenv: true,
  });
}
