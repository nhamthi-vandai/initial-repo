import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { AuthResponseDto, LoginDto, RegisterDto } from '../dto/auth.dto';

export class AuthService {
  constructor(private app: FastifyInstance) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const client = await this.app.pg.connect();
    try {
      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1 AND tenant_id = $2',
        [dto.email, dto.tenantId],
      );

      if (existingUser.rows.length > 0) {
        throw new Error('Email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // Create user
      const result = await client.query(
        `INSERT INTO users (name, email, password, tenant_id, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, role, tenant_id`,
        [dto.name, dto.email, hashedPassword, dto.tenantId, 'user'],
      );

      const user = result.rows[0];

      // Generate JWT token
      const token = this.app.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenant_id,
        },
      };
    } finally {
      client.release();
    }
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const client = await this.app.pg.connect();
    try {
      const result = await client.query(
        'SELECT id, name, email, password, role, tenant_id FROM users WHERE email = $1 AND tenant_id = $2',
        [dto.email, dto.tenantId],
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = result.rows[0];

      // Verify password
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = this.app.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenant_id,
        },
      };
    } finally {
      client.release();
    }
  }
}
