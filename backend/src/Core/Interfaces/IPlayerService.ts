import { Player } from '../Entities';

/**
 * IPlayerService - Interface for player-related business operations
 * 
 * This interface defines the contract that any PlayerService implementation
 * must follow. It separates the business logic from the implementation details.
 */
export interface IPlayerService {
    /**
     * Create a new player
     * @param username - Player's username
     * @param email - Player's email (optional)
     * @returns Promise<Player> - The created player
     */
    createPlayer(username: string, email?: string): Promise<Player>;

    /**
     * Get player by ID
     * @param id - Player's unique identifier
     * @returns Promise<Player | null> - The player or null if not found
     */
    getPlayerById(id: string): Promise<Player | null>;

    /**
     * Get player by username
     * @param username - Player's username
     * @returns Promise<Player | null> - The player or null if not found
     */
    getPlayerByUsername(username: string): Promise<Player | null>;

    /**
     * Update player information
     * @param id - Player's unique identifier
     * @param updates - Partial player data to update
     * @returns Promise<Player> - The updated player
     */
    updatePlayer(id: string, updates: Partial<Omit<Player, 'id' | 'createdAt'>>): Promise<Player>;

    /**
     * Deactivate player account
     * @param id - Player's unique identifier
     * @returns Promise<boolean> - True if successful
     */
    deactivatePlayer(id: string): Promise<boolean>;

    /**
     * Reactivate player account
     * @param id - Player's unique identifier
     * @returns Promise<boolean> - True if successful
     */
    reactivatePlayer(id: string): Promise<boolean>;

    /**
     * Update player's last login time
     * @param id - Player's unique identifier
     * @returns Promise<boolean> - True if successful
     */
    updateLastLogin(id: string): Promise<boolean>;

    /**
     * Check if username is available
     * @param username - Username to check
     * @returns Promise<boolean> - True if available
     */
    isUsernameAvailable(username: string): Promise<boolean>;

    /**
     * Get all active players
     * @param limit - Maximum number of players to return
     * @param offset - Number of players to skip
     * @returns Promise<Player[]> - Array of active players
     */
    getActivePlayers(limit?: number, offset?: number): Promise<Player[]>;

    /**
     * Search players by username pattern
     * @param pattern - Username pattern to search for
     * @param limit - Maximum number of results
     * @returns Promise<Player[]> - Array of matching players
     */
    searchPlayersByUsername(pattern: string, limit?: number): Promise<Player[]>;
} 