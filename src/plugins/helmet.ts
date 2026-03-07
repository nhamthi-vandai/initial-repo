import helmet from '@fastify/helmet';
import { FastifyInstance } from 'fastify';

async function plugin(app: FastifyInstance): Promise<void> {
  await app.register(helmet, {
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
  });
}
(plugin as any)[Symbol.for('skip-override')] = true;
export default plugin;
