# Enterprise Multi-Tenant API

A production-ready **enterprise-level multi-tenant API** built with Fastify, TypeScript, PostgreSQL, MongoDB, JWT authentication, and auto-generated documentation.

## Features

- ⚡ **[Fastify v5](https://fastify.dev/)** — Fast and low-overhead web framework
- 🔷 **TypeScript** — Full type safety with enterprise-level architecture
- 🏢 **Multi-Tenancy** — Full tenant isolation with tenant context middleware
- 🔐 **JWT Authentication** — Secure authentication with @fastify/jwt
- 🐘 **PostgreSQL** — Relational database via `@fastify/postgres`
- 🍃 **MongoDB** — NoSQL database support via `@fastify/mongodb`
- 🌍 **Internationalization (i18n)** — Multi-language support with i18next
- 📊 **Unified API Responses** — Consistent response format for success and errors
- 📚 **Auto-Generated Documentation** — Swagger/OpenAPI documentation at `/docs`
- 🏗️ **Enterprise Architecture** — Modular design with services, repositories, and DTOs
- 🐳 **Docker & Docker Compose** — Containerized dev and production environments
- 🐶 **Husky** — Git hooks for code quality enforcement
- 📏 **ESLint + Prettier** — Code style and linting
- 🔒 **Security** — Helmet, CORS, and rate limiting
- 🧪 **Jest** — Unit and integration tests
- 📝 **Conventional Commits** — Enforced via commitlint

## Project Structure

```
fastify-boilerplate/
├── src/
│   ├── app.ts                    # Fastify app factory
│   ├── server.ts                 # Entry point
│   ├── core/
│   │   ├── i18n/                 # Internationalization
│   │   ├── middleware/           # Global middleware (auth, tenant)
│   │   ├── types/                # Shared TypeScript types
│   │   └── utils/                # Utility functions (response formatter)
│   ├── modules/
│   │   ├── auth/                 # Authentication module
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── dto/
│   │   └── users/                # Users module
│   │       ├── routes/
│   │       ├── services/
│   │       ├── repositories/
│   │       └── dto/
│   ├── plugins/
│   │   ├── cors.ts
│   │   ├── helmet.ts
│   │   ├── postgres.ts
│   │   ├── mongodb.ts
│   │   ├── jwt.ts
│   │   ├── swagger.ts
│   │   ├── rateLimit.ts
│   │   └── sensible.ts
│   └── routes/
│       ├── health.ts             # Health check endpoints
│       └── root.ts               # Root endpoint
├── locales/
│   ├── en/                       # English translations
│   └── es/                       # Spanish translations
├── db/
│   ├── init.sql                  # Initial DB schema and seed data
│   └── migrations/
│       ├── 001_create_users_table.sql
│       └── 002_add_multitenancy_fields.sql
├── tests/
├── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
└── ...
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 22
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- PostgreSQL 16+
- MongoDB (optional, for NoSQL features)

### Local Development (without Docker)

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your local values
   ```

3. **Start PostgreSQL** (using Docker):

   ```bash
   docker run -d \
     --name fastify-postgres \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=fastify_db \
     -p 5432:5432 \
     postgres:16-alpine
   ```

4. **Start MongoDB** (optional, using Docker):

   ```bash
   docker run -d \
     --name fastify-mongo \
     -p 27017:27017 \
     mongo:latest
   ```

5. **Run database migrations:**

   ```bash
   # Connect to postgres and run migrations
   psql -h localhost -U postgres -d fastify_db -f db/init.sql
   psql -h localhost -U postgres -d fastify_db -f db/migrations/002_add_multitenancy_fields.sql
   ```

6. **Run the dev server:**

   ```bash
   npm run dev
   ```

7. **Access the API:**
   - API: http://localhost:3000
   - Documentation: http://localhost:3000/docs

### Development with Docker Compose

```bash
# Start dev environment (hot-reload enabled)
docker compose -f docker-compose.dev.yml up

# Stop
docker compose -f docker-compose.dev.yml down
```

### Production with Docker Compose

```bash
# Start production environment
cp .env.example .env
# Edit .env with production values

docker compose up -d

# Stop
docker compose down
```

## API Endpoints

### General

| Method | Endpoint | Description                   |
| ------ | -------- | ----------------------------- |
| GET    | `/`      | Welcome message with API info |
| GET    | `/docs`  | Swagger documentation (HTML)  |

### Health Check

| Method | Endpoint     | Description              |
| ------ | ------------ | ------------------------ |
| GET    | `/health`    | Application health check |
| GET    | `/health/db` | Database health check    |

### Authentication

| Method | Endpoint                | Description   | Auth Required |
| ------ | ----------------------- | ------------- | ------------- |
| POST   | `/api/v1/auth/register` | Register user | No            |
| POST   | `/api/v1/auth/login`    | Login user    | No            |

### Users (Protected)

| Method | Endpoint            | Description       | Auth Required |
| ------ | ------------------- | ----------------- | ------------- |
| GET    | `/api/v1/users`     | List all users    | Yes (JWT)     |
| GET    | `/api/v1/users/:id` | Get user by ID    | Yes (JWT)     |
| POST   | `/api/v1/users`     | Create a new user | Yes (JWT)     |
| PUT    | `/api/v1/users/:id` | Update a user     | Yes (JWT)     |
| DELETE | `/api/v1/users/:id` | Delete a user     | Yes (JWT)     |

## Multi-Tenancy

The API supports multi-tenancy through tenant isolation. Tenants can be identified via:

1. **HTTP Header**: `x-tenant-id: tenant1`
2. **Query Parameter**: `?tenantId=tenant1`
3. **Subdomain**: `tenant1.yourdomain.com`

All authenticated requests automatically enforce tenant isolation, ensuring users can only access data from their own tenant.

## Authentication Flow

### 1. Register a new user

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "tenantId": "tenant1"
  }'
```

Response:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "tenantId": "tenant1"
    }
  },
  "timestamp": "2026-03-08T06:00:00.000Z"
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "tenantId": "tenant1"
  }'
```

### 3. Access protected endpoints

```bash
curl http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-tenant-id: tenant1"
```

## Unified API Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": { ... },  // Optional (pagination, etc.)
  "timestamp": "2026-03-08T06:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": { ... }  // Optional
  },
  "timestamp": "2026-03-08T06:00:00.000Z"
}
```

## Internationalization (i18n)

The API supports multiple languages. Set the language via:

1. **Environment variable**: `DEFAULT_LANGUAGE=en`
2. **Request header**: `Accept-Language: es`

Currently supported languages:

- English (en)
- Spanish (es)

Translation files are located in `/locales/{lang}/translation.json`.

## Environment Variables

See `.env.example` for all available environment variables.

| Variable                | Description                  | Default                                |
| ----------------------- | ---------------------------- | -------------------------------------- |
| `NODE_ENV`              | Environment                  | `development`                          |
| `PORT`                  | Server port                  | `3000`                                 |
| `HOST`                  | Server host                  | `0.0.0.0`                              |
| `LOG_LEVEL`             | Logging level                | `info`                                 |
| `DATABASE_URL`          | PostgreSQL connection string | —                                      |
| `MONGODB_URL`           | MongoDB connection string    | `mongodb://localhost:27017/fastify_db` |
| `JWT_SECRET`            | JWT secret key               | —                                      |
| `JWT_EXPIRES_IN`        | JWT expiration time          | `24h`                                  |
| `CORS_ORIGIN`           | Allowed CORS origins         | `*`                                    |
| `RATE_LIMIT_MAX`        | Max requests per window      | `100`                                  |
| `RATE_LIMIT_TIMEWINDOW` | Rate limit window (ms)       | `60000`                                |
| `DEFAULT_LANGUAGE`      | Default language             | `en`                                   |

## Scripts

| Command                 | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start development server with hot-reload |
| `npm run build`         | Compile TypeScript to JavaScript         |
| `npm start`             | Start production server                  |
| `npm test`              | Run tests                                |
| `npm run test:coverage` | Run tests with coverage report           |
| `npm run lint`          | Run ESLint                               |
| `npm run lint:fix`      | Auto-fix ESLint issues                   |
| `npm run format`        | Format code with Prettier                |
| `npm run typecheck`     | Type-check without emitting              |

## Enterprise-Level Architecture

### Modular Design

The codebase follows a **modular architecture** with clear separation of concerns:

- **Modules**: Feature-based modules (auth, users, etc.)
- **Services**: Business logic layer
- **Repositories**: Data access layer
- **DTOs**: Data Transfer Objects for type safety
- **Middleware**: Cross-cutting concerns (auth, tenant, etc.)
- **Utils**: Shared utilities and helpers

### Design Patterns

- **Repository Pattern**: Separates data access logic
- **Service Layer**: Encapsulates business logic
- **Dependency Injection**: Via constructor injection
- **Middleware Pattern**: For cross-cutting concerns
- **Factory Pattern**: For building the app instance

### Benefits

- ✅ High testability
- ✅ Easy to maintain and extend
- ✅ Clear code organization
- ✅ Type-safe end-to-end
- ✅ Scalable architecture

## Git Hooks (Husky)

- **pre-commit**: Runs `lint-staged` (ESLint + Prettier on staged files)
- **commit-msg**: Validates commit message against [Conventional Commits](https://www.conventionalcommits.org/)

### Commit Message Format

```
type(scope): subject

Examples:
feat(auth): add JWT authentication
feat(users): implement multi-tenancy
fix(health): correct db health check query
docs: update README with new features
chore: update dependencies
```

## License

[MIT](LICENSE)
