import { buildApp } from '../../src/app';

// Mock the postgres plugin to avoid needing a real DB in tests.
// The plugin function must be non-encapsulated (Symbol.for('skip-override'))
// so that app.pg is visible to route handlers in the parent scope.
jest.mock('../../src/plugins/postgres', () => {
  const plugin = async (app: any) => {
    app.decorate('pg', {
      connect: jest.fn().mockResolvedValue({
        query: jest.fn().mockResolvedValue({ rows: [] }),
        release: jest.fn(),
      }),
    });
  };
  (plugin as any)[Symbol.for('skip-override')] = true;
  return { default: plugin };
});

describe('Root Routes', () => {
  const app = buildApp({ logger: false });

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET / should return welcome message', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.message).toBe('Welcome to Fastify Boilerplate API');
    expect(body.docs).toBe('/docs');
  });
});
