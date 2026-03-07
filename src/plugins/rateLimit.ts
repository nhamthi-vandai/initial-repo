import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';

async function plugin(app: FastifyInstance): Promise<void> {
  await app.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    timeWindow: parseInt(process.env.RATE_LIMIT_TIMEWINDOW || '60000'),
  });
}
(plugin as any)[Symbol.for('skip-override')] = true;
export default plugin;
