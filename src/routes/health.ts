import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ResponseUtil } from '../core/utils/response.util';

export default async function healthRoutes(app: FastifyInstance): Promise<void> {
  // GET /health - Application health check
  app.get(
    '/health',
    {
      schema: {
        tags: ['health'],
        description: 'Application health check',
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  status: { type: 'string' },
                  uptime: { type: 'number' },
                  timestamp: { type: 'string' },
                },
              },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const healthData = {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      };
      return ResponseUtil.success(reply, healthData, 'Service is healthy');
    },
  );

  // GET /health/db - Database health check
  app.get(
    '/health/db',
    {
      schema: {
        tags: ['health'],
        description: 'Database health check',
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  postgres: { type: 'string' },
                  timestamp: { type: 'string' },
                },
              },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const client = await app.pg.connect();
        try {
          await client.query('SELECT 1');
          const healthData = {
            postgres: 'connected',
            timestamp: new Date().toISOString(),
          };
          return ResponseUtil.success(reply, healthData, 'Database is healthy');
        } finally {
          client.release();
        }
      } catch {
        const healthData = {
          postgres: 'disconnected',
          timestamp: new Date().toISOString(),
        };
        return ResponseUtil.error(reply, 'Database is unhealthy', 503, 'DB_ERROR', healthData);
      }
    },
  );
}
