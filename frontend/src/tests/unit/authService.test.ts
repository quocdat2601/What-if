import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AuthService from '../../services/authService';
import { User, LoginRequest, RegisterRequest } from '../../types/auth';

// Mock axios completely
vi.mock('axios', () => {
  const mockAxiosInstance = {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  };

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance)
    }
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('AuthService', () => {
  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: undefined,
    isActive: true
  };

  const mockLoginRequest: LoginRequest = {
    username: 'testuser',
    password: 'password123'
  };

  const mockRegisterRequest: RegisterRequest = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: mockUser,
            token: 'mock-token'
          }
        }
      };

      const axios = await import('axios');
      const axiosInstance = axios.default.create();
      (axiosInstance.post as any).mockResolvedValueOnce(mockResponse);

      const result = await AuthService.register(mockRegisterRequest);

      expect(result.success).toBe(true);
      expect(result.data?.user).toEqual(mockUser);
      expect(result.data?.token).toBe('mock-token');
    });

    it('should handle registration error', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Username already exists'
          }
        }
      };

      const axios = await import('axios');
      const axiosInstance = axios.default.create();
      (axiosInstance.post as any).mockRejectedValueOnce(mockError);

      try {
        await AuthService.register(mockRegisterRequest);
      } catch (error: any) {
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.message).toBe('Username already exists');
      }
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: mockUser,
            token: 'mock-token'
          }
        }
      };

      const axios = await import('axios');
      const axiosInstance = axios.default.create();
      (axiosInstance.post as any).mockResolvedValueOnce(mockResponse);

      const result = await AuthService.login(mockLoginRequest);

      expect(result.success).toBe(true);
      expect(result.data?.user).toEqual(mockUser);
      expect(result.data?.token).toBe('mock-token');
    });

    it('should handle login error', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            message: 'Invalid credentials'
          }
        }
      };

      const axios = await import('axios');
      const axiosInstance = axios.default.create();
      (axiosInstance.post as any).mockRejectedValueOnce(mockError);

      try {
        await AuthService.login(mockLoginRequest);
      } catch (error: any) {
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.message).toBe('Invalid credentials');
      }
    });
  });

  describe('logout', () => {
    it('should clear auth data on logout', async () => {
      // Mock the logout API call to succeed
      const axios = await import('axios');
      const axiosInstance = axios.default.create();
      (axiosInstance.post as any).mockResolvedValueOnce({});
      
      await AuthService.logout();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('token management', () => {
    it('should get token from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      const token = AuthService.getToken();
      expect(token).toBe('mock-token');
    });

    it('should return null if no token in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const token = AuthService.getToken();
      expect(token).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', () => {
      localStorageMock.getItem.mockReturnValue('mock-token');
      const isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(true);
    });

    it('should return false if no token', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(false);
    });
  });

  describe('getUser', () => {
    it('should return user from localStorage', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
      const user = AuthService.getUser();
      expect(user).toEqual(mockUser);
    });

    it('should return null if no user in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const user = AuthService.getUser();
      expect(user).toBeNull();
    });
  });

  describe('setAuthData', () => {
    it('should set auth data in localStorage', () => {
      AuthService.setAuthData('mock-token', mockUser);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', 'mock-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });
  });

  describe('clearAuthData', () => {
    it('should clear auth data from localStorage', () => {
      AuthService.clearAuthData();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            token: 'new-mock-token'
          }
        }
      };

      const axios = await import('axios');
      const axiosInstance = axios.default.create();
      (axiosInstance.post as any).mockResolvedValueOnce(mockResponse);

      const result = await AuthService.refreshToken();
      expect(result).toBe(true);
    });
  });
}); 