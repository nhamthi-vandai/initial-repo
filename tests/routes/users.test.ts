import { buildApp } from '../../src/app';

// All jest.fn() instances are created inside the factory (runs at hoist time),
// then retrieved via jest.requireMock so tests can configure per-call behaviour.
// The plugin is marked non-encapsulated so app.pg is visible in route scope.
jest.mock('../../src/plugins/postgres', () => {
  const mockQuery = jest.fn();
  const mockRelease = jest.fn();
  const mockConnect = jest.fn().mockResolvedValue({ query: mockQuery, release: mockRelease });

  const plugin = async (app: any) => {
    app.decorate('pg', { connect: mockConnect });
  };
  (plugin as any)[Symbol.for('skip-override')] = true;

  return { default: plugin, _mocks: { mockQuery, mockRelease, mockConnect } };
});

const { _mocks } = jest.requireMock('../../src/plugins/postgres') as {
  _mocks: { mockQuery: jest.Mock; mockRelease: jest.Mock; mockConnect: jest.Mock };
};
const { mockQuery, mockRelease, mockConnect } = _mocks;

describe('User Routes', () => {
  const app = buildApp({ logger: false });

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Restore the default resolved value for connect after clearAllMocks
    mockConnect.mockResolvedValue({ query: mockQuery, release: mockRelease });
  });

  it('GET /api/v1/users should return array of users', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          name: 'Alice',
          email: 'alice@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/users',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(Array.isArray(body)).toBe(true);
    expect(body[0].name).toBe('Alice');
    expect(mockRelease).toHaveBeenCalled();
  });

  it('GET /api/v1/users/:id should return 404 when user not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/users/999',
    });

    expect(response.statusCode).toBe(404);
    expect(mockRelease).toHaveBeenCalled();
  });

  it('POST /api/v1/users should create and return new user', async () => {
    const newUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockQuery.mockResolvedValueOnce({ rows: [newUser] });

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { name: 'Test User', email: 'test@example.com' },
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.email).toBe('test@example.com');
    expect(mockRelease).toHaveBeenCalled();
  });

  it('POST /api/v1/users should return 400 for invalid body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { name: 'No Email' },
    });

    expect(response.statusCode).toBe(400);
  });

  it('DELETE /api/v1/users/:id should return 204 on success', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    const response = await app.inject({
      method: 'DELETE',
      url: '/api/v1/users/1',
    });

    expect(response.statusCode).toBe(204);
    expect(mockRelease).toHaveBeenCalled();
  });

  it('DELETE /api/v1/users/:id should return 404 when user not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const response = await app.inject({
      method: 'DELETE',
      url: '/api/v1/users/999',
    });

    expect(response.statusCode).toBe(404);
    expect(mockRelease).toHaveBeenCalled();
  });
});
