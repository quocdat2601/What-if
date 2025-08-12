import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Database Connection Service
 * 
 * This service manages the PostgreSQL database connection using connection pooling
 * for better performance and reliability.
 */
export class Database {
    private static instance: Database;
    private pool: Pool;

    private constructor() {
        // Create connection pool
        this.pool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: process.env.DB_NAME || 'whatif_db',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            max: 20, // Maximum number of clients in the pool
            idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
            connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
        });

        // Handle pool errors
        this.pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });

        // Test connection on startup
        this.testConnection();
    }

    /**
     * Get singleton instance of Database
     */
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    /**
     * Test database connection
     */
    private async testConnection(): Promise<void> {
        try {
            const client = await this.pool.connect();
            console.log('✅ Database connected successfully!');
            client.release();
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            throw error;
        }
    }

    /**
     * Get a client from the pool
     */
    public async getClient(): Promise<PoolClient> {
        return await this.pool.connect();
    }

    /**
     * Execute a query with parameters
     */
    public async query(text: string, params?: any[]): Promise<any> {
        const client = await this.getClient();
        try {
            const result = await client.query(text, params);
            return result;
        } finally {
            client.release();
        }
    }

    /**
     * Execute a transaction
     */
    public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await this.getClient();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Close all connections in the pool
     */
    public async close(): Promise<void> {
        await this.pool.end();
        console.log('Database connections closed');
    }

    /**
     * Get pool statistics
     */
    public getPoolStats() {
        return {
            totalCount: this.pool.totalCount,
            idleCount: this.pool.idleCount,
            waitingCount: this.pool.waitingCount
        };
    }
}

// Export singleton instance
export const database = Database.getInstance(); 