import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { ResponseUtil } from '../../../core/utils/response.util';
import { t } from '../../../core/i18n';

export default async function authRoutes(app: FastifyInstance): Promise<void> {
  const authService = new AuthService(app);

  // POST /auth/register - Register a new user
  app.post<{ Body: RegisterDto }>(
    '/register',
    {
      schema: {
        tags: ['auth'],
        description: 'Register a new user',
        body: {
          type: 'object',
          required: ['email', 'password', 'name', 'tenantId'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            name: { type: 'string', minLength: 1 },
            tenantId: { type: 'string', minLength: 1 },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string' },
                      role: { type: 'string' },
                      tenantId: { type: 'string' },
                    },
                  },
                },
              },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: RegisterDto }>, reply: FastifyReply) => {
      try {
        const result = await authService.register(request.body);
        return ResponseUtil.created(reply, result, t('auth.registerSuccess'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (_error: any) {
        if (_error.message === 'Email already exists') {
          return ResponseUtil.badRequest(reply, t('auth.emailExists'));
        }
        return ResponseUtil.error(reply, t('auth.registerFailed'));
      }
    },
  );

  // POST /auth/login - Login
  app.post<{ Body: LoginDto }>(
    '/login',
    {
      schema: {
        tags: ['auth'],
        description: 'Login to get JWT token',
        body: {
          type: 'object',
          required: ['email', 'password', 'tenantId'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            tenantId: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string' },
                      role: { type: 'string' },
                      tenantId: { type: 'string' },
                    },
                  },
                },
              },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: LoginDto }>, reply: FastifyReply) => {
      try {
        const result = await authService.login(request.body);
        return ResponseUtil.success(reply, result, t('auth.loginSuccess'));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      } catch (_error: any) {
        return ResponseUtil.unauthorized(reply, t('auth.loginFailed'));
      }
    },
  );
}
