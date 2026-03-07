import { buildApp } from '../../src/app';

// Mark the mock plugin as non-encapsulated so app.pg is visible in route scope.
jest.mock('../../src/plugins/postgres', () => {
  const plugin = async (app: any) => {
    app.decorate('pg', {
      connect: jest.fn().mockResolvedValue({
        query: jest.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }),
        release: jest.fn(),
      }),
    });
  };
  (plugin as any)[Symbol.for('skip-override')] = true;
  return { default: plugin };
});

describe('Health Routes', () => {
  const app = buildApp({ logger: false });

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health should return 200 with status ok', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe('ok');
    expect(body.timestamp).toBeDefined();
    expect(body.uptime).toBeGreaterThanOrEqual(0);
    expect(body.environment).toBe('test');
  });

  it('GET /health/db should return 200 when database is connected', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health/db',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe('ok');
    expect(body.database).toBe('connected');
  });
});
