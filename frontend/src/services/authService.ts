import axios from 'axios';
import { 
    LoginRequest, 
    RegisterRequest, 
    AuthResponse, 
    User, 
    ApiResponse 
} from '../types/auth';

/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls including:
 * - User registration
 * - User login
 * - User logout
 * - Token management
 * - User profile updates
 */

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect on 401 if user is already logged in (has token)
        if (error.response?.status === 401 && localStorage.getItem('authToken')) {
            // Token expired or invalid for authenticated user
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        // For login failures, just reject the error without redirecting
        return Promise.reject(error);
    }
);

export class AuthService {
    /**
     * Register a new user
     */
    static async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
        try {
            const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) {
                return error.response.data;
            }
            throw new Error('Registration failed');
        }
    }

    /**
     * Login user
     */
    static async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
        return response.data;
    }

    /**
     * Logout user
     */
    static async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    }

    /**
     * Get current user profile
     */
    static async getCurrentUser(): Promise<ApiResponse<User>> {
        try {
            const response = await api.get<ApiResponse<User>>('/auth/me');
            return response.data;
        } catch (error: any) {
            if (error.response?.data) {
                return error.response.data;
            }
            throw new Error('Failed to get user profile');
        }
    }

    /**
     * Update user profile
     */
    static async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
        try {
            const response = await api.put<ApiResponse<User>>('/auth/profile', data);
            return response.data;
        } catch (error: any) {
            if (error.response?.data) {
                return error.response.data;
            }
            throw new Error('Failed to update profile');
        }
    }

    /**
     * Check if user is authenticated
     */
    static isAuthenticated(): boolean {
        const token = localStorage.getItem('authToken');
        return !!token;
    }

    /**
     * Get stored auth token
     */
    static getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    /**
     * Get stored user data
     */
    static getUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    }

    /**
     * Store authentication data
     */
    static setAuthData(token: string, user: User): void {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Clear authentication data
     */
    static clearAuthData(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }

    /**
     * Refresh authentication token
     */
    static async refreshToken(): Promise<boolean> {
        try {
            const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');
            if (response.data.success && response.data.data) {
                localStorage.setItem('authToken', response.data.data.token);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
}

export default AuthService; 