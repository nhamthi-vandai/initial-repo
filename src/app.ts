import Fastify, { FastifyInstance } from 'fastify';
import sensiblePlugin from './plugins/sensible';
import corsPlugin from './plugins/cors';
import helmetPlugin from './plugins/helmet';
import rateLimitPlugin from './plugins/rateLimit';
import postgresPlugin from './plugins/postgres';
import rootRoutes from './routes/root';
import healthRoutes from './routes/health';
import userRoutes from './routes/users';

export function buildApp(opts: Record<string, unknown> = {}): FastifyInstance {
  const app = Fastify({
    logger: opts.logger ?? {
      level: process.env.LOG_LEVEL || 'info',
      transport:
        process.env.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
    ...opts,
  });

  // Register plugins
  app.register(sensiblePlugin);
  app.register(corsPlugin);
  app.register(helmetPlugin);
  app.register(rateLimitPlugin);
  app.register(postgresPlugin);

  // Register routes
  app.register(rootRoutes);
  app.register(healthRoutes);
  app.register(userRoutes, { prefix: '/api/v1' });

  return app;
}
