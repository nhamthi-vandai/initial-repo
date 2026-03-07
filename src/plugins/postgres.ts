import pgPlugin from '@fastify/postgres';
import { FastifyInstance } from 'fastify';

async function plugin(app: FastifyInstance): Promise<void> {
  await app.register(pgPlugin, {
    connectionString:
      process.env.DATABASE_URL ||
      `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  });
}
(plugin as any)[Symbol.for('skip-override')] = true;
export default plugin;
