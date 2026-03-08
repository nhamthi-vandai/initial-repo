import { FastifyInstance } from 'fastify';
import fastifyJWT from '@fastify/jwt';

export default async function jwtPlugin(app: FastifyInstance): Promise<void> {
  await app.register(fastifyJWT, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch {
      reply.status(401).send({
        success: false,
        message: 'Unauthorized',
        error: {
          code: 'UNAUTHORIZED',
        },
        timestamp: new Date().toISOString(),
      });
    }
  });
}
