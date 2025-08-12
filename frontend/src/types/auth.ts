/**
 * Authentication Types for What If... Game
 */

export interface User {
    id: string;
    username: string;
    email?: string;
    createdAt: string;
    lastLogin?: string;
    isActive: boolean;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email?: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    message: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message: string;
    errors?: ValidationError[];
} 