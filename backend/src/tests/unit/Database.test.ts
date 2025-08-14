import { Database } from '../../Infrastructure/Database/Database';

// Mock pg module
jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [{ id: 1, name: 'test' }] }),
      release: jest.fn()
    }),
    end: jest.fn(),
    on: jest.fn() // Add missing on method
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
      await database.query('SELECT * FROM test WHERE name = $1 AND id = $2', params);
      
      // Verify the mock was called with correct parameters
      const mockPool = require('pg').Pool.mock.instances[0];
      const mockClient = mockPool.connect.mock.results[0].value;
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM test WHERE name = $1 AND id = $2',
        params
      );
    });

    it('should release client after query', async () => {
      await database.query('SELECT * FROM test');
      
      const mockPool = require('pg').Pool.mock.instances[0];
      const mockClient = mockPool.connect.mock.results[0].value;
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle query errors gracefully', async () => {
      const mockPool = require('pg').Pool.mock.instances[0];
      const mockClient = mockPool.connect.mock.results[0].value;
      
      // Mock query to throw error
      mockClient.query.mockRejectedValueOnce(new Error('Database error'));
      
      await expect(database.query('SELECT * FROM invalid_table')).rejects.toThrow('Database error');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle connection errors gracefully', async () => {
      const mockPool = require('pg').Pool.mock.instances[0];
      
      // Mock connect to throw error
      mockPool.connect.mockRejectedValueOnce(new Error('Connection failed'));
      
      await expect(database.query('SELECT * FROM test')).rejects.toThrow('Connection failed');
    });
  });

  describe('connection management', () => {
    it('should create new connection pool with correct config', () => {
      // Verify Pool was constructed with correct configuration
      const Pool = require('pg').Pool;
      expect(Pool).toHaveBeenCalledWith({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'whatif_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
      });
    });
  });
}); 