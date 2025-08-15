import { Player } from '../../../Core/Entities';
import { database } from '../Database';

/**
 * PlayerRepository - Data Access Layer for Player entities
 * 
 * This repository handles all database operations related to players,
 * including CRUD operations and custom queries.
 */
export class PlayerRepository {
    /**
     * Create a new player in the database
     */
    async create(player: Player): Promise<Player> {
        const query = `
            INSERT INTO players (id, username, email, created_at, last_login, is_active)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const values = [
            player.id,
            player.username,
            player.email,
            player.createdAt,
            player.lastLogin,
            player.isActive
        ];

        try {
            const result = await database.query(query, values);
            return Player.fromData(result.rows[0]);
        } catch (error) {
            console.error('Error creating player:', error);
            throw new Error('Failed to create player');
        }
    }

    /**
     * Find player by ID
     */
    async findById(id: string): Promise<Player | null> {
        const query = 'SELECT * FROM players WHERE id = $1 AND is_active = true';
        
        try {
            const result = await database.query(query, [id]);
            if (result.rows.length === 0) {
                return null;
            }
            return Player.fromData(result.rows[0]);
        } catch (error) {
            console.error('Error finding player by ID:', error);
            throw new Error('Failed to find player');
        }
    }

    /**
     * Find player by username
     */
    async findByUsername(username: string): Promise<Player | null> {
        const query = 'SELECT * FROM players WHERE username = $1 AND is_active = true';
        
        try {
            const result = await database.query(query, [username]);
            if (result.rows.length === 0) {
                return null;
            }
            return Player.fromData(result.rows[0]);
        } catch (error) {
            console.error('Error finding player by username:', error);
            throw new Error('Failed to find player');
        }
    }

    /**
     * Find player by email
     */
    async findByEmail(email: string): Promise<Player | null> {
        const query = 'SELECT * FROM players WHERE email = $1 AND is_active = true';
        
        try {
            const result = await database.query(query, [email]);
            if (result.rows.length === 0) {
                return null;
            }
            return Player.fromData(result.rows[0]);
        } catch (error) {
            console.error('Error finding player by email:', error);
            throw new Error('Failed to find player');
        }
    }

    /**
     * Update player information
     */
    async update(id: string, updates: Partial<Omit<Player, 'id' | 'createdAt'>>): Promise<Player> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        // Build dynamic update query
        if (updates.username !== undefined) {
            fields.push(`username = $${paramCount++}`);
            values.push(updates.username);
        }
        if (updates.email !== undefined) {
            fields.push(`email = $${paramCount++}`);
            values.push(updates.email);
        }
        if (updates.lastLogin !== undefined) {
            fields.push(`last_login = $${paramCount++}`);
            values.push(updates.lastLogin);
        }
        if (updates.isActive !== undefined) {
            fields.push(`is_active = $${paramCount++}`);
            values.push(updates.isActive);
        }

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        const query = `
            UPDATE players 
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `;
        values.push(id);

        try {
            const result = await database.query(query, values);
            if (result.rows.length === 0) {
                throw new Error('Player not found');
            }
            return Player.fromData(result.rows[0]);
        } catch (error) {
            console.error('Error updating player:', error);
            throw new Error('Failed to update player');
        }
    }

    /**
     * Deactivate player account
     */
    async deactivate(id: string): Promise<boolean> {
        const query = 'UPDATE players SET is_active = false WHERE id = $1 RETURNING id';
        
        try {
            const result = await database.query(query, [id]);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Error deactivating player:', error);
            throw new Error('Failed to deactivate player');
        }
    }

    /**
     * Reactivate player account
     */
    async reactivate(id: string): Promise<boolean> {
        const query = 'UPDATE players SET is_active = true WHERE id = $1 RETURNING id';
        
        try {
            const result = await database.query(query, [id]);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Error reactivating player:', error);
            throw new Error('Failed to reactivate player');
        }
    }

    /**
     * Update last login time
     */
    async updateLastLogin(id: string): Promise<boolean> {
        const query = 'UPDATE players SET last_login = NOW() WHERE id = $1 RETURNING id';
        
        try {
            const result = await database.query(query, [id]);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Error updating last login:', error);
            throw new Error('Failed to update last login');
        }
    }

    /**
     * Check if username is available
     */
    async isUsernameAvailable(username: string): Promise<boolean> {
        const query = 'SELECT COUNT(*) FROM players WHERE username = $1 AND is_active = true';
        
        try {
            const result = await database.query(query, [username]);
            return parseInt(result.rows[0].count) === 0;
        } catch (error) {
            console.error('Error checking username availability:', error);
            throw new Error('Failed to check username availability');
        }
    }

    /**
     * Get all active players with pagination
     */
    async findActivePlayers(limit: number = 10, offset: number = 0): Promise<Player[]> {
        const query = `
            SELECT * FROM players 
            WHERE is_active = true 
            ORDER BY created_at DESC 
            LIMIT $1 OFFSET $2
        `;
        
        try {
            const result = await database.query(query, [limit, offset]);
            return result.rows.map((row: any) => Player.fromData(row));
        } catch (error) {
            console.error('Error finding active players:', error);
            throw new Error('Failed to find active players');
        }
    }

    /**
     * Search players by username pattern
     */
    async searchByUsername(pattern: string, limit: number = 10): Promise<Player[]> {
        const query = `
            SELECT * FROM players 
            WHERE username ILIKE $1 AND is_active = true 
            ORDER BY username 
            LIMIT $2
        `;
        
        try {
            const result = await database.query(query, [`%${pattern}%`, limit]);
            return result.rows.map((row: any) => Player.fromData(row));
        } catch (error) {
            console.error('Error searching players by username:', error);
            throw new Error('Failed to search players');
        }
    }

    /**
     * Get total count of active players
     */
    async getActivePlayerCount(): Promise<number> {
        const query = 'SELECT COUNT(*) FROM players WHERE is_active = true';
        
        try {
            const result = await database.query(query);
            return parseInt(result.rows[0].count);
        } catch (error) {
            console.error('Error getting active player count:', error);
            throw new Error('Failed to get player count');
        }
    }
} 