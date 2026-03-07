import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export default async function rootRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    '/',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              docs: { type: 'string' },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      return reply.send({
        message: 'Welcome to Fastify Boilerplate API',
        docs: '/docs',
      });
    },
  );
}
