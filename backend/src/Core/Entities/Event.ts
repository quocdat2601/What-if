/**
 * Event Entity - Core domain object representing a game event
 * 
 * Events are the core gameplay mechanic where players make choices
 * that affect their character's stats and story progression.
 */
export interface Choice {
    id: string;
    text: string;
    effects: StatEffect[];
    chainedEventId?: string;
}

export interface StatEffect {
    stat: string;
    delta: number;
    description?: string;
}

export type EventType = 'milestone' | 'random' | 'opportunity' | 'chain';
export type EventSource = 'scripted' | 'ai_generated' | 'ai_cached';

export class Event {
    public readonly id: string;
    public eventId: string; // e.g., "evt_00123"
    public type: EventType;
    public title: string;
    public description: string;
    public minAge: number;
    public maxAge: number;
    public prerequisites: Record<string, any> | null;
    public choices: Choice[];
    public tags: string[];
    public branchWeight: number;
    public rarityFactor: number;
    public source: EventSource;
    public aiSignatureHash?: string;
    public readonly createdAt: Date;
    public isActive: boolean;

    constructor(
        eventId: string,
        type: EventType,
        title: string,
        description: string,
        minAge: number = 0,
        maxAge: number = 120,
        choices: Choice[],
        tags: string[] = [],
        branchWeight: number = 1.0,
        rarityFactor: number = 1.0,
        source: EventSource = 'scripted',
        prerequisites: Record<string, any> | null = null,
        aiSignatureHash?: string,
        id?: string,
        createdAt?: Date,
        isActive: boolean = true
    ) {
        // Validate input
        this.validateEventId(eventId);
        this.validateTitle(title);
        this.validateDescription(description);
        this.validateAgeRange(minAge, maxAge);
        this.validateChoices(choices);
        this.validateBranchWeight(branchWeight);
        this.validateRarityFactor(rarityFactor);

        // Set properties
        this.id = id ?? this.generateId();
        this.eventId = eventId;
        this.type = type;
        this.title = title;
        this.description = description;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.choices = choices;
        this.tags = tags;
        this.branchWeight = branchWeight;
        this.rarityFactor = rarityFactor;
        this.source = source;
        this.prerequisites = prerequisites;
        if (aiSignatureHash) {
            this.aiSignatureHash = aiSignatureHash;
        }
        this.createdAt = createdAt || new Date();
        this.isActive = isActive;
    }

    /**
     * Generate a unique ID for the event
     */
    private generateId(): string {
        return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // =====================================================
    // BUSINESS LOGIC METHODS
    // =====================================================

    /**
     * Check if event can be triggered for a player at given age
     */
    public canTriggerAt(age: number): boolean {
        return this.isActive && age >= this.minAge && age <= this.maxAge;
    }

    /**
     * Check if event meets prerequisites for a player
     */
    public meetsPrerequisites(playerStats: Record<string, any>): boolean {
        if (!this.prerequisites) {
            return true; // No prerequisites
        }

        // Simple prerequisite checking - can be enhanced
        for (const [stat, _requirement] of Object.entries(this.prerequisites)) {
            if (playerStats[stat] === undefined) {
                return false;
            }
            // Add more complex logic here as needed
        }

        return true;
    }

    /**
     * Get event score for selection algorithm
     * Higher score = more likely to be selected
     */
    public getSelectionScore(): number {
        return this.branchWeight * this.rarityFactor;
    }

    /**
     * Check if event is rare (high rarity factor)
     */
    public isRare(): boolean {
        return this.rarityFactor > 2.0;
    }

    /**
     * Check if event is common (low rarity factor)
     */
    public isCommon(): boolean {
        return this.rarityFactor < 0.5;
    }

    /**
     * Get random choice (for AI or testing)
     */
    public getRandomChoice(): Choice {
        const randomIndex = Math.floor(Math.random() * this.choices.length);
        return this.choices[randomIndex];
    }

    /**
     * Check if event has chained events
     */
    public hasChainedEvents(): boolean {
        return this.choices.some(choice => choice.chainedEventId);
    }

    // =====================================================
    // VALIDATION METHODS
    // =====================================================

    private validateEventId(eventId: string): void {
        if (!eventId || eventId.length < 5 || eventId.length > 20) {
            throw new Error('Event ID must be between 5 and 20 characters');
        }

        if (!/^evt_\d+$/.test(eventId)) {
            throw new Error('Event ID must follow pattern: evt_XXXXX');
        }
    }

    private validateTitle(title: string): void {
        if (!title || title.length < 3 || title.length > 255) {
            throw new Error('Event title must be between 3 and 255 characters');
        }
    }

    private validateDescription(description: string): void {
        if (!description || description.length < 10) {
            throw new Error('Event description must be at least 10 characters');
        }
    }

    private validateAgeRange(minAge: number, maxAge: number): void {
        if (minAge < 0 || maxAge > 120) {
            throw new Error('Age range must be between 0 and 120');
        }

        if (minAge > maxAge) {
            throw new Error('Min age cannot be greater than max age');
        }
    }

    private validateChoices(choices: Choice[]): void {
        if (!choices || choices.length < 2 || choices.length > 4) {
            throw new Error('Event must have between 2 and 4 choices');
        }

        // Validate each choice
        choices.forEach((choice, index) => {
            if (!choice.id || choice.id.length < 1) {
                throw new Error(`Choice ${index + 1} must have a valid ID`);
            }
            if (!choice.text || choice.text.length < 1) {
                throw new Error(`Choice ${index + 1} must have text`);
            }
            if (!choice.effects || choice.effects.length === 0) {
                throw new Error(`Choice ${index + 1} must have at least one effect`);
            }
        });
    }

    private validateBranchWeight(branchWeight: number): void {
        if (branchWeight < 0.0 || branchWeight > 10.0) {
            throw new Error('Branch weight must be between 0.0 and 10.0');
        }
    }

    private validateRarityFactor(rarityFactor: number): void {
        if (rarityFactor < 0.1 || rarityFactor > 10.0) {
            throw new Error('Rarity factor must be between 0.1 and 10.0');
        }
    }

    // =====================================================
    // UTILITY METHODS
    // =====================================================

    /**
     * Get event summary for display
     */
    public getSummary(): string {
        return `${this.title} (${this.type}) - ${this.choices.length} choices`;
    }

    /**
     * Check if event matches any of the given tags
     */
    public hasTag(tag: string): boolean {
        return this.tags.includes(tag);
    }

    /**
     * Check if event matches any of the given types
     */
    public hasType(type: EventType): boolean {
        return this.type === type;
    }

    /**
     * Get all stat types affected by this event's choices
     */
    public getAffectedStats(): string[] {
        const stats = new Set<string>();
        this.choices.forEach(choice => {
            choice.effects.forEach(effect => {
                stats.add(effect.stat);
            });
        });
        return Array.from(stats);
    }

    // =====================================================
    // STATIC FACTORY METHODS
    // =====================================================

    /**
     * Create a milestone event
     */
    public static createMilestone(
        eventId: string,
        title: string,
        description: string,
        age: number,
        choices: Choice[],
        tags: string[] = []
    ): Event {
        return new Event(
            eventId,
            'milestone',
            title,
            description,
            age,
            age, // Same min and max age for milestones
            choices,
            tags,
            1.0, // High branch weight for milestones
            1.0  // Normal rarity
        );
    }

    /**
     * Create a random event
     */
    public static createRandom(
        eventId: string,
        title: string,
        description: string,
        minAge: number,
        maxAge: number,
        choices: Choice[],
        tags: string[] = [],
        rarityFactor: number = 1.0
    ): Event {
        return new Event(
            eventId,
            'random',
            title,
            description,
            minAge,
            maxAge,
            choices,
            tags,
            0.8, // Lower branch weight for random events
            rarityFactor
        );
    }

    /**
     * Create an opportunity event
     */
    public static createOpportunity(
        eventId: string,
        title: string,
        description: string,
        minAge: number,
        maxAge: number,
        choices: Choice[],
        tags: string[] = []
    ): Event {
        return new Event(
            eventId,
            'opportunity',
            title,
            description,
            minAge,
            maxAge,
            choices,
            tags,
            0.9, // High branch weight for opportunities
            1.2  // Slightly rare
        );
    }

    /**
     * Create event from data (e.g., from database)
     */
    public static fromData(data: {
        id: string;
        eventId: string;
        type: EventType;
        title: string;
        description: string;
        minAge: number;
        maxAge: number;
        choices: Choice[];
        tags: string[];
        branchWeight: number;
        rarityFactor: number;
        source: EventSource;
        prerequisites?: Record<string, any> | null;
        aiSignatureHash?: string;
        createdAt: Date;
        isActive: boolean;
    }): Event {
        return new Event(
            data.eventId,
            data.type,
            data.title,
            data.description,
            data.minAge,
            data.maxAge,
            data.choices,
            data.tags,
            data.branchWeight,
            data.rarityFactor,
            data.source,
            data.prerequisites || null,
            data.aiSignatureHash,
            data.id,
            data.createdAt,
            data.isActive
        );
    }
} 