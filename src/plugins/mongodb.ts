import { FastifyInstance } from 'fastify';
import fastifyMongodb from '@fastify/mongodb';

export default async function mongoPlugin(app: FastifyInstance): Promise<void> {
  const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/fastify_db';

  await app.register(fastifyMongodb, {
    url: mongoUrl,
    forceClose: true,
  });

  app.log.info('MongoDB connected successfully');
}
