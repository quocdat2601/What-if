import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AuthService from '../../services/authService';

// Mock axios
const mockAxiosInstance = {
  post: vi.fn(),
  get: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() }
  }
};

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance)
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
global.localStorage = localStorageMock as Storage;

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'User registered successfully',
          data: { user: { id: 1, username: 'testuser' } }
        }
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/auth/register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });
    });

    it('should handle registration errors', async () => {
      const mockError = {
        response: {
          data: { message: 'Username already exists' },
          status: 400
        }
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      await expect(AuthService.register({
        username: 'existinguser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      })).rejects.toEqual(mockError);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Login successful',
          data: {
            token: 'mock_jwt_token',
            user: { id: 1, username: 'testuser' }
          }
        }
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.login({
        username: 'testuser',
        password: 'password123'
      });

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/auth/login', {
        username: 'testuser',
        password: 'password123'
      });
    });

    it('should handle login errors', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid credentials' },
          status: 401
        }
      };

      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      await expect(AuthService.login({
        username: 'testuser',
        password: 'wrongpassword'
      })).rejects.toEqual(mockError);
    });
  });

  describe('logout', () => {
    it('should clear auth data from localStorage', () => {
      AuthService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user profile successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { id: 1, username: 'testuser', email: 'test@example.com', createdAt: '2023-01-01', isActive: true }
        }
      };

      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.getCurrentUser();

      expect(result).toEqual(mockResponse.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/auth/me');
    });

    it('should handle profile fetch errors', async () => {
      const mockError = {
        response: {
          data: { message: 'User not found' },
          status: 404
        }
      };

      mockAxiosInstance.get.mockRejectedValueOnce(mockError);

      await expect(AuthService.getCurrentUser()).rejects.toEqual(mockError);
    });
  });

  describe('token management', () => {
    it('should get token from localStorage', () => {
      localStorageMock.getItem.mockReturnValueOnce('mock_token');
      
      const token = AuthService.getToken();
      
      expect(token).toBe('mock_token');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('authToken');
    });

    it('should return null when no token exists', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      
      const token = AuthService.getToken();
      
      expect(token).toBeNull();
    });

    it('should set auth data in localStorage', () => {
      const mockToken = 'mock_jwt_token';
      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com', createdAt: '2023-01-01', isActive: true };

      AuthService.setAuthData(mockToken, mockUser);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', mockToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorageMock.getItem.mockReturnValueOnce('mock_token');
      
      const isAuth = AuthService.isAuthenticated();
      
      expect(isAuth).toBe(true);
    });

    it('should return false when no token exists', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      
      const isAuth = AuthService.isAuthenticated();
      
      expect(isAuth).toBe(false);
    });
  });

  describe('getUser', () => {
    it('should return user from localStorage', () => {
      const mockUser = { id: '1', username: 'testuser', email: 'test@example.com', createdAt: '2023-01-01', isActive: true };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockUser));
      
      const user = AuthService.getUser();
      
      expect(user).toEqual(mockUser);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user');
    });

    it('should return null when no user exists', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      
      const user = AuthService.getUser();
      
      expect(user).toBeNull();
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid_json');
      
      const user = AuthService.getUser();
      
      expect(user).toBeNull();
    });
  });
}); 