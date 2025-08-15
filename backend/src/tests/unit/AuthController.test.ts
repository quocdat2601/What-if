import { Request, Response } from 'express';
import { AuthController } from '../../Presentation/Controllers/AuthController';
import { Database } from '../../Infrastructure/Database/Database';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password_123'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_jwt_token_123')
}));

// Mock Database
jest.mock('../../Infrastructure/Database/Database', () => ({
  Database: {
    getInstance: jest.fn().mockReturnValue({
      query: jest.fn().mockResolvedValue({
        rows: [{ id: 1, username: 'testuser', email: 'test@example.com' }]
      })
    })
  }
}));

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockDatabase: jest.Mocked<Database>;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockDatabase = Database.getInstance() as jest.Mocked<Database>;
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      mockRequest.body = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      // Mock database queries
      mockDatabase.query
        .mockResolvedValueOnce({ rows: [] }) // Check existing user
        .mockResolvedValueOnce({ 
          rows: [{ 
            id: 1, 
            username: 'newuser', 
            email: 'new@example.com', 
            created_at: '2024-01-01T00:00:00Z' 
          }] 
        }); // Insert user

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        data: { 
          user: { 
            id: 1, 
            username: 'newuser', 
            email: 'new@example.com', 
            createdAt: '2024-01-01T00:00:00Z'
          } 
        }
      });
    });

    it('should return error when passwords do not match', async () => {
      mockRequest.body = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword'
      };

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Passwords do not match'
      });
    });

    it('should return error when username is too short', async () => {
      mockRequest.body = {
        username: 'ab',
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Username must be at least 3 characters'
      });
    });

    it('should return error when password is too short', async () => {
      mockRequest.body = {
        username: 'newuser',
        email: 'new@example.com',
        password: '123',
        confirmPassword: '123'
      };

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    });

    it('should handle database errors gracefully', async () => {
      mockRequest.body = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };

      // Mock database error on first query
      mockDatabase.query.mockRejectedValueOnce(new Error('Database connection failed'));

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
        error: 'Database connection failed'
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      mockRequest.body = {
        username: 'testuser',
        password: 'password123'
      };

      // Mock database to return user with hashed password
      mockDatabase.query
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            password_hash: 'hashed_password_123',
            created_at: '2024-01-01T00:00:00Z'
          }]
        }) // Find user
        .mockResolvedValueOnce({ rows: [] }); // Update last login

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      // AuthController uses res.json() not res.status(200).json()
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        data: {
          token: 'mock_jwt_token_123',
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            createdAt: '2024-01-01T00:00:00Z'
          }
        }
      });
    });

    it('should return error when user not found', async () => {
      mockRequest.body = {
        username: 'nonexistent',
        password: 'password123'
      };

      // Mock database to return no users
      mockDatabase.query.mockResolvedValueOnce({ rows: [] });

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid username or password'
      });
    });

    it('should return error when password is incorrect', async () => {
      mockRequest.body = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      // Mock database to return user
      mockDatabase.query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          password_hash: 'hashed_password_123',
          created_at: '2024-01-01T00:00:00Z'
        }]
      });

      // Mock bcrypt.compare to return false (wrong password)
      const bcrypt = require('bcrypt');
      bcrypt.compare.mockResolvedValueOnce(false);

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid username or password'
      });
    });
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      mockRequest.params = { id: '1' };

      // Mock database to return user
      mockDatabase.query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          created_at: '2024-01-01T00:00:00Z',
          last_login: '2024-01-01T12:00:00Z',
          is_active: true
        }]
      });

      await AuthController.getProfile(mockRequest as Request, mockResponse as Response);

      // AuthController uses res.json() not res.status(200).json()
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { 
          user: { 
            id: 1, 
            username: 'testuser', 
            email: 'test@example.com',
            createdAt: '2024-01-01T00:00:00Z',
            lastLogin: '2024-01-01T12:00:00Z',
            isActive: true
          } 
        }
      });
    });

    it('should return error when user not found', async () => {
      mockRequest.params = { id: '999' };

      // Mock database to return no users
      mockDatabase.query.mockResolvedValueOnce({ rows: [] });

      await AuthController.getProfile(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });
  });
}); 