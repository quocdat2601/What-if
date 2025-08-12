import { Request, Response } from 'express';
import { Database } from '../../Infrastructure/Database/Database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {
    /**
     * Register a new user
     */
    static async register(req: Request, res: Response): Promise<Response> {
        try {
            const { username, email, password, confirmPassword } = req.body;

            // Validation
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username and password are required'
                });
            }

            if (username.length < 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Username must be at least 3 characters'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters'
                });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Passwords do not match'
                });
            }

            const db = Database.getInstance();

            // Check if username already exists
            const existingUser = await db.query(
                'SELECT id FROM players WHERE username = $1',
                [username]
            );

            if (existingUser.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already exists'
                });
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create user
            const result = await db.query(
                'INSERT INTO players (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
                [username, email || null, hashedPassword]
            );

            const newUser = result.rows[0];

            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        id: newUser.id,
                        username: newUser.username,
                        email: newUser.email,
                        createdAt: newUser.created_at
                    }
                }
            });

        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Login user
     */
    static async login(req: Request, res: Response): Promise<Response> {
        try {
            const { username, password } = req.body;

            // Validation
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username and password are required'
                });
            }

            const db = Database.getInstance();

            // Find user by username
            const result = await db.query(
                'SELECT id, username, email, password_hash, created_at FROM players WHERE username = $1 AND is_active = true',
                [username]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid username or password'
                });
            }

            const user = result.rows[0];

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid username or password'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: '24h' }
            );

            // Update last login
            await db.query(
                'UPDATE players SET last_login = NOW() WHERE id = $1',
                [user.id]
            );

            return res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        createdAt: user.created_at
                    },
                    token: token
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Get current user profile
     */
    static async getProfile(req: Request, res: Response): Promise<Response> {
        try {
            // This would be protected by middleware in production
            const userId = req.params.id || req.body.userId;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }

            const db = Database.getInstance();
            const result = await db.query(
                'SELECT id, username, email, created_at, last_login, is_active FROM players WHERE id = $1 AND is_active = true',
                [userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const user = result.rows[0];

            return res.json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        createdAt: user.created_at,
                        lastLogin: user.last_login,
                        isActive: user.is_active
                    }
                }
            });

        } catch (error) {
            console.error('Get profile error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
} 