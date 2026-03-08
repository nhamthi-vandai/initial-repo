import { FastifyInstance } from 'fastify';
import { UserResponseDto, CreateUserDto, UpdateUserDto } from '../dto/user.dto';

export class UserRepository {
  constructor(private app: FastifyInstance) {}

  async findAll(tenantId: string): Promise<UserResponseDto[]> {
    const client = await this.app.pg.connect();
    try {
      const result = await client.query(
        `SELECT id, name, email, role, tenant_id as "tenantId", created_at as "createdAt", updated_at as "updatedAt"
         FROM users
         WHERE tenant_id = $1
         ORDER BY id`,
        [tenantId],
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  async findById(id: string, tenantId: string): Promise<UserResponseDto | null> {
    const client = await this.app.pg.connect();
    try {
      const result = await client.query(
        `SELECT id, name, email, role, tenant_id as "tenantId", created_at as "createdAt", updated_at as "updatedAt"
         FROM users
         WHERE id = $1 AND tenant_id = $2`,
        [id, tenantId],
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const client = await this.app.pg.connect();
    try {
      const result = await client.query(
        `INSERT INTO users (name, email, tenant_id, role)
         VALUES ($1, $2, $3, 'user')
         RETURNING id, name, email, role, tenant_id as "tenantId", created_at as "createdAt", updated_at as "updatedAt"`,
        [dto.name, dto.email, dto.tenantId],
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async update(id: string, tenantId: string, dto: UpdateUserDto): Promise<UserResponseDto | null> {
    const client = await this.app.pg.connect();
    try {
      const result = await client.query(
        `UPDATE users SET
          name = COALESCE($1, name),
          email = COALESCE($2, email),
          updated_at = NOW()
         WHERE id = $3 AND tenant_id = $4
         RETURNING id, name, email, role, tenant_id as "tenantId", created_at as "createdAt", updated_at as "updatedAt"`,
        [dto.name, dto.email, id, tenantId],
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    const client = await this.app.pg.connect();
    try {
      const result = await client.query(
        'DELETE FROM users WHERE id = $1 AND tenant_id = $2 RETURNING id',
        [id, tenantId],
      );
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }
}
