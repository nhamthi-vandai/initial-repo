import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
}

export default async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    '/health',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
              uptime: { type: 'number' },
              environment: { type: 'string' },
              version: { type: 'string' },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply): Promise<HealthResponse> => {
      return reply.send({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
      });
    },
  );

  app.get('/health/db', {}, async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const client = await app.pg.connect();
      await client.query('SELECT 1');
      client.release();
      return reply.send({ status: 'ok', database: 'connected' });
    } catch (error) {
      app.log.error(error, 'Database health check failed');
      return reply.status(503).send({ status: 'error', database: 'disconnected' });
    }
  });
}
