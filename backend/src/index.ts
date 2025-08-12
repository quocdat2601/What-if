import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Database } from './Infrastructure/Database/Database';
import { AuthController } from './Presentation/Controllers/AuthController';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: 'Connected'
    });
});

// Test database connection
app.get('/api/test-db', async (_req, res) => {
    try {
        const db = Database.getInstance();
        const result = await db.query('SELECT NOW() as current_time');
        return res.json({ 
            status: 'Database connected successfully',
            current_time: result.rows[0].current_time
        });
    } catch (error) {
        console.error('Database connection error:', error);
        return res.status(500).json({ 
            status: 'Database connection failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Auth endpoints
app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/login', AuthController.login);
app.get('/api/auth/profile/:id', AuthController.getProfile);

// Basic player endpoints (legacy)
app.post('/api/players', async (req, res) => {
    try {
        const { username, email } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const db = Database.getInstance();
        const result = await db.query(
            'INSERT INTO players (username, email) VALUES ($1, $2) RETURNING id, username, email, created_at',
            [username, email || null]
        );

        return res.status(201).json({
            message: 'Player created successfully',
            player: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating player:', error);
        return res.status(500).json({ 
            error: 'Failed to create player',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.get('/api/players/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = Database.getInstance();
        
        const result = await db.query(
            'SELECT id, username, email, created_at, last_login, is_active FROM players WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        return res.json({ player: result.rows[0] });
    } catch (error) {
        console.error('Error fetching player:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch player',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 What If... Backend Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🗄️ Database test: http://localhost:${PORT}/api/test-db`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
    console.log(`👥 Players API: http://localhost:${PORT}/api/players`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
}); 