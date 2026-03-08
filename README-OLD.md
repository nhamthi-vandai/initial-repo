# Fastify Boilerplate

A production-ready **Fastify** boilerplate built with TypeScript, PostgreSQL, Husky, and Docker.

## Features

- ⚡ **[Fastify v5](https://fastify.dev/)** — Fast and low-overhead web framework
- 🔷 **TypeScript** — Full type safety
- 🐘 **PostgreSQL** — Relational database via `@fastify/postgres`
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
│   ├── app.ts              # Fastify app factory
│   ├── server.ts           # Entry point
│   ├── config/
│   │   └── env.ts          # Environment variable schema
│   ├── plugins/
│   │   ├── cors.ts
│   │   ├── helmet.ts
│   │   ├── postgres.ts
│   │   ├── rateLimit.ts
│   │   └── sensible.ts
│   └── routes/
│       ├── health.ts       # Health check endpoints
│       ├── root.ts         # Root endpoint
│       └── users.ts        # CRUD example
├── tests/
│   └── routes/
│       ├── health.test.ts
│       ├── root.test.ts
│       └── users.test.ts
├── db/
│   ├── init.sql            # Initial DB schema and seed data
│   └── migrations/
│       └── 001_create_users_table.sql
├── Dockerfile
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
├── .env.example
└── ...
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 22
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

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

4. **Run the dev server:**
   ```bash
   npm run dev
   ```

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

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/`                 | Welcome message          |
| GET    | `/health`           | Application health check |
| GET    | `/health/db`        | Database health check    |
| GET    | `/api/v1/users`     | List all users           |
| GET    | `/api/v1/users/:id` | Get user by ID           |
| POST   | `/api/v1/users`     | Create a new user        |
| PUT    | `/api/v1/users/:id` | Update a user            |
| DELETE | `/api/v1/users/:id` | Delete a user            |

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

## Git Hooks (Husky)

- **pre-commit**: Runs `lint-staged` (ESLint + Prettier on staged files)
- **commit-msg**: Validates commit message against [Conventional Commits](https://www.conventionalcommits.org/)

### Commit Message Format

```
type(scope): subject

Examples:
feat(users): add user authentication
fix(health): correct db health check query
docs: update README with Docker instructions
chore: update dependencies
```

## Environment Variables

See `.env.example` for all available environment variables.

| Variable                | Description                  | Default       |
| ----------------------- | ---------------------------- | ------------- |
| `NODE_ENV`              | Environment                  | `development` |
| `PORT`                  | Server port                  | `3000`        |
| `HOST`                  | Server host                  | `0.0.0.0`     |
| `LOG_LEVEL`             | Logging level                | `info`        |
| `DATABASE_URL`          | PostgreSQL connection string | —             |
| `CORS_ORIGIN`           | Allowed CORS origins         | `*`           |
| `RATE_LIMIT_MAX`        | Max requests per window      | `100`         |
| `RATE_LIMIT_TIMEWINDOW` | Rate limit window (ms)       | `60000`       |

## License

[MIT](LICENSE)
