import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ResponseUtil } from '../core/utils/response.util';

export default async function rootRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    '/',
    {
      schema: {
        tags: ['general'],
        description: 'Welcome endpoint with API information',
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  version: { type: 'string' },
                  documentation: { type: 'string' },
                  features: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
              },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const data = {
        name: 'Enterprise Multi-Tenant API',
        version: '1.0.0',
        documentation: '/docs',
        features: [
          'Multi-tenancy support',
          'JWT Authentication',
          'PostgreSQL & MongoDB support',
          'Internationalization (i18n)',
          'Unified API responses',
          'Auto-generated documentation',
          'Enterprise-level architecture',
        ],
      };
      return ResponseUtil.success(reply, data, 'Welcome to the API');
    },
  );
}
