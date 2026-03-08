import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { TenantRequest } from '../../../core/types/tenant.types';
import { ResponseUtil } from '../../../core/utils/response.util';
import { authMiddleware } from '../../../core/middleware/auth.middleware';
import { t } from '../../../core/i18n';

interface UserParams {
  id: string;
}

export default async function userRoutes(app: FastifyInstance): Promise<void> {
  const userRepository = new UserRepository(app);
  const userService = new UserService(userRepository);

  // GET /users - List all users (with authentication and tenant isolation)
  app.get(
    '/users',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['users'],
        description: 'Get all users for the authenticated tenant',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                    tenantId: { type: 'string' },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                  },
                },
              },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const tenantRequest = request as TenantRequest;
      const tenantId = tenantRequest.tenant?.tenantId;

      if (!tenantId) {
        return ResponseUtil.badRequest(reply, t('tenant.required'));
      }

      const users = await userService.getAllUsers(tenantId);
      return ResponseUtil.success(reply, users, t('users.listSuccess'));
    },
  );

  // GET /users/:id - Get user by ID (with authentication and tenant isolation)
  app.get<{ Params: UserParams }>(
    '/users/:id',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['users'],
        description: 'Get user by ID',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
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
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' },
                  tenantId: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) => {
      const tenantRequest = request as TenantRequest;
      const { id } = request.params;
      const tenantId = tenantRequest.tenant?.tenantId;

      if (!tenantId) {
        return ResponseUtil.badRequest(reply, t('tenant.required'));
      }

      const user = await userService.getUserById(id, tenantId);

      if (!user) {
        return ResponseUtil.notFound(reply, t('users.notFound'));
      }

      return ResponseUtil.success(reply, user, t('common.success'));
    },
  );

  // POST /users - Create a user (with authentication and tenant isolation)
  app.post<{ Body: CreateUserDto }>(
    '/users',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['users'],
        description: 'Create a new user',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
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
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' },
                  tenantId: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateUserDto }>, reply: FastifyReply) => {
      const tenantRequest = request as TenantRequest;
      const tenantId = tenantRequest.tenant?.tenantId;

      if (!tenantId) {
        return ResponseUtil.badRequest(reply, t('tenant.required'));
      }

      const dto: CreateUserDto = {
        ...request.body,
        tenantId,
      };

      const user = await userService.createUser(dto);
      return ResponseUtil.created(reply, user, t('users.created'));
    },
  );

  // PUT /users/:id - Update a user (with authentication and tenant isolation)
  app.put<{ Params: UserParams; Body: UpdateUserDto }>(
    '/users/:id',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['users'],
        description: 'Update a user',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
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
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' },
                  tenantId: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: UserParams; Body: UpdateUserDto }>,
      reply: FastifyReply,
    ) => {
      const tenantRequest = request as TenantRequest;
      const { id } = request.params;
      const tenantId = tenantRequest.tenant?.tenantId;

      if (!tenantId) {
        return ResponseUtil.badRequest(reply, t('tenant.required'));
      }

      const user = await userService.updateUser(id, tenantId, request.body);

      if (!user) {
        return ResponseUtil.notFound(reply, t('users.notFound'));
      }

      return ResponseUtil.success(reply, user, t('users.updated'));
    },
  );

  // DELETE /users/:id - Delete a user (with authentication and tenant isolation)
  app.delete<{ Params: UserParams }>(
    '/users/:id',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['users'],
        description: 'Delete a user',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) => {
      const tenantRequest = request as TenantRequest;
      const { id } = request.params;
      const tenantId = tenantRequest.tenant?.tenantId;

      if (!tenantId) {
        return ResponseUtil.badRequest(reply, t('tenant.required'));
      }

      const deleted = await userService.deleteUser(id, tenantId);

      if (!deleted) {
        return ResponseUtil.notFound(reply, t('users.notFound'));
      }

      return ResponseUtil.success(reply, null, t('users.deleted'));
    },
  );
}
