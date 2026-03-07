import sensible from '@fastify/sensible';
import { FastifyInstance } from 'fastify';

async function plugin(app: FastifyInstance): Promise<void> {
  await app.register(sensible);
}
(plugin as any)[Symbol.for('skip-override')] = true;
export default plugin;
