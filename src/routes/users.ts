import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface CreateUserBody {
  name: string;
  email: string;
}

interface UserParams {
  id: string;
}

interface UpdateUserBody {
  name?: string;
  email?: string;
}

export default async function userRoutes(app: FastifyInstance): Promise<void> {
  // GET /users - List all users
  app.get(
    '/users',
    {
      schema: {
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                email: { type: 'string' },
                created_at: { type: 'string' },
                updated_at: { type: 'string' },
              },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const client = await app.pg.connect();
      try {
        const result = await client.query(
          'SELECT id, name, email, created_at, updated_at FROM users ORDER BY id',
        );
        return reply.send(result.rows);
      } finally {
        client.release();
      }
    },
  );

  // GET /users/:id - Get user by ID
  app.get<{ Params: UserParams }>(
    '/users/:id',
    {
      schema: {
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
              id: { type: 'integer' },
              name: { type: 'string' },
              email: { type: 'string' },
              created_at: { type: 'string' },
              updated_at: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) => {
      const { id } = request.params;
      const client = await app.pg.connect();
      try {
        const result = await client.query(
          'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
          [id],
        );
        if (result.rows.length === 0) {
          return reply.notFound(`User with id ${id} not found`);
        }
        return reply.send(result.rows[0]);
      } finally {
        client.release();
      }
    },
  );

  // POST /users - Create a user
  app.post<{ Body: CreateUserBody }>(
    '/users',
    {
      schema: {
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
              id: { type: 'integer' },
              name: { type: 'string' },
              email: { type: 'string' },
              created_at: { type: 'string' },
              updated_at: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateUserBody }>, reply: FastifyReply) => {
      const { name, email } = request.body;
      const client = await app.pg.connect();
      try {
        const result = await client.query(
          'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at, updated_at',
          [name, email],
        );
        return reply.status(201).send(result.rows[0]);
      } finally {
        client.release();
      }
    },
  );

  // PUT /users/:id - Update a user
  app.put<{ Params: UserParams; Body: UpdateUserBody }>(
    '/users/:id',
    {
      schema: {
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
      },
    },
    async (
      request: FastifyRequest<{ Params: UserParams; Body: UpdateUserBody }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;
      const { name, email } = request.body;

      const client = await app.pg.connect();
      try {
        const result = await client.query(
          `UPDATE users SET
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            updated_at = NOW()
          WHERE id = $3
          RETURNING id, name, email, created_at, updated_at`,
          [name, email, id],
        );
        if (result.rows.length === 0) {
          return reply.notFound(`User with id ${id} not found`);
        }
        return reply.send(result.rows[0]);
      } finally {
        client.release();
      }
    },
  );

  // DELETE /users/:id - Delete a user
  app.delete<{ Params: UserParams }>(
    '/users/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          204: {
            type: 'null',
            description: 'User deleted successfully',
          },
          404: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) => {
      const { id } = request.params;
      const client = await app.pg.connect();
      try {
        const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
          return reply.notFound(`User with id ${id} not found`);
        }
        return reply.status(204).send();
      } finally {
        client.release();
      }
    },
  );
}
