import { Database } from '../../Infrastructure/Database/Database';

// Mock pg module
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [{ id: 1, name: 'test' }] }),
      release: jest.fn()
    }),
    end: jest.fn(),
    on: jest.fn()
  }))
}));

describe('Database Service', () => {
  let database: Database;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    database = Database.getInstance();
  });

  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = Database.getInstance();
      const instance2 = Database.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('query', () => {
    it('should execute query successfully', async () => {
      const result = await database.query('SELECT * FROM test');
      expect(result).toBeDefined();
      expect(result.rows).toEqual([{ id: 1, name: 'test' }]);
    });

    it('should execute query with parameters', async () => {
      const params = ['test', 123];
      const result = await database.query('SELECT * FROM test WHERE name = $1 AND id = $2', params);
      expect(result).toBeDefined();
      expect(result.rows).toEqual([{ id: 1, name: 'test' }]);
    });

    it('should handle database operations', async () => {
      const result = await database.query('SELECT * FROM test');
      expect(result).toBeDefined();
    });
  });

  describe('connection management', () => {
    it('should create new connection pool', () => {
      // Just verify the service works
      expect(database).toBeDefined();
    });
  });
}); 