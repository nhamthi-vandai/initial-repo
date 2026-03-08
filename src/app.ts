import Fastify, { FastifyInstance } from 'fastify';
import sensiblePlugin from './plugins/sensible';
import corsPlugin from './plugins/cors';
import helmetPlugin from './plugins/helmet';
import rateLimitPlugin from './plugins/rateLimit';
import postgresPlugin from './plugins/postgres';
import mongoPlugin from './plugins/mongodb';
import jwtPlugin from './plugins/jwt';
import swaggerPlugin from './plugins/swagger';
import rootRoutes from './routes/root';
import healthRoutes from './routes/health';
import authRoutes from './modules/auth/routes/auth.routes';
import userRoutes from './modules/users/routes/user.routes';
import { initI18n } from './core/i18n';

export async function buildApp(opts: Record<string, unknown> = {}): Promise<FastifyInstance> {
  // Initialize i18n
  await initI18n();

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

  // Register core plugins
  await app.register(sensiblePlugin);
  await app.register(corsPlugin);
  await app.register(helmetPlugin);
  await app.register(rateLimitPlugin);

  // Register database plugins
  await app.register(postgresPlugin);

  // Register MongoDB plugin (optional, can be disabled if not needed)
  try {
    await app.register(mongoPlugin);
  } catch {
    app.log.warn('MongoDB connection failed, continuing without MongoDB support');
  }

  // Register authentication plugin
  await app.register(jwtPlugin);

  // Register Swagger documentation plugin
  await app.register(swaggerPlugin);

  // Register routes
  await app.register(rootRoutes);
  await app.register(healthRoutes);
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(userRoutes, { prefix: '/api/v1' });

  // Global error handler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.setErrorHandler((error: any, _request, reply) => {
    app.log.error(error);

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    reply.status(statusCode).send({
      success: false,
      message,
      error: {
        code: error.code || 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
