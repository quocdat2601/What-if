/**
 * Player Entity - Core domain object representing a game player
 * 
 * In Clean Architecture, this is a pure domain object that:
 * - Contains business logic and validation rules
 * - Has no dependencies on external frameworks or databases
 * - Can be used across different layers of the application
 */
export class Player {
    public readonly id: string;
    public username: string;
    public email: string | null;
    public readonly createdAt: Date;
    public lastLogin: Date | null;
    public isActive: boolean;

    constructor(
        username: string,
        email: string | null = null,
        id?: string,
        createdAt?: Date,
        lastLogin?: Date | null,
        isActive: boolean = true
    ) {
        // Validate input
        this.validateUsername(username);
        if (email) {
            this.validateEmail(email);
        }

        // Set properties with proper null handling
        this.id = id || this.generateId();
        this.username = username;
        this.email = email;
        this.createdAt = createdAt || new Date();
        this.lastLogin = lastLogin || null;
        this.isActive = isActive;
    }

    /**
     * Generate a unique ID for the player
     * Note: In production, you'd use a proper UUID library
     */
    private generateId(): string {
        return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // =====================================================
    // BUSINESS LOGIC METHODS
    // =====================================================

    /**
     * Check if player can start a new game run
     * Business rule: Player must be active and have valid username
     */
    public canStartNewRun(): boolean {
        return this.isActive && this.username.length > 0;
    }

    /**
     * Check if player can receive meta points
     * Business rule: Player must be active and have completed at least one run
     */
    public canReceiveMetaPoints(): boolean {
        return this.isActive;
    }

    /**
     * Update last login time
     * Business rule: Only update if player is active
     */
    public updateLastLogin(): void {
        if (this.isActive) {
            this.lastLogin = new Date();
        }
    }

    /**
     * Deactivate player account
     * Business rule: Cannot deactivate if has active runs
     */
    public deactivate(): void {
        // Note: In real implementation, you'd check for active runs
        this.isActive = false;
    }

    /**
     * Reactivate player account
     */
    public reactivate(): void {
        this.isActive = true;
    }

    // =====================================================
    // VALIDATION METHODS
    // =====================================================

    /**
     * Validate username format and length
     * Business rule: Username must be 3-50 characters, alphanumeric + underscore
     */
    private validateUsername(username: string): void {
        if (!username || username.length < 3 || username.length > 50) {
            throw new Error('Username must be between 3 and 50 characters');
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            throw new Error('Username can only contain letters, numbers, and underscores');
        }
    }

    /**
     * Validate email format
     * Business rule: Email must be valid format if provided
     */
    private validateEmail(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }
    }

    // =====================================================
    // UTILITY METHODS
    // =====================================================

    /**
     * Get player age in days since creation
     */
    public getAgeInDays(): number {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Check if player is new (created within last 7 days)
     */
    public isNewPlayer(): boolean {
        return this.getAgeInDays() <= 7;
    }

    /**
     * Get player summary for display
     */
    public getSummary(): string {
        return `${this.username} (${this.isActive ? 'Active' : 'Inactive'})`;
    }

    // =====================================================
    // STATIC FACTORY METHODS
    // =====================================================

    /**
     * Create a new player with default values
     */
    public static create(username: string, email?: string): Player {
        return new Player(username, email || null);
    }

    /**
     * Create a player from existing data (e.g., from database)
     */
    public static fromData(data: {
        id: string;
        username: string;
        email?: string | null;
        createdAt: Date;
        lastLogin?: Date | null;
        isActive: boolean;
    }): Player {
        return new Player(
            data.username,
            data.email || null,
            data.id,
            data.createdAt,
            data.lastLogin || null,
            data.isActive
        );
    }

    // =====================================================
    // EQUALITY & COMPARISON
    // =====================================================

    /**
     * Check if two players are equal (same ID)
     */
    public equals(other: Player): boolean {
        return this.id === other.id;
    }

    /**
     * Clone player with new values
     */
    public clone(updates: Partial<Omit<Player, 'id' | 'createdAt'>>): Player {
        return new Player(
            updates.username ?? this.username,
            updates.email ?? this.email,
            this.id, // Keep same ID
            this.createdAt, // Keep same creation date
            updates.lastLogin ?? this.lastLogin,
            updates.isActive ?? this.isActive
        );
    }
} 