import { Event, Choice } from '../../Core/Entities/Event';

describe('Event Entity', () => {
  let mockEvent: Event;
  let mockChoices: Choice[];

  beforeEach(() => {
    mockChoices = [
      {
        id: 'choice1',
        text: 'Accept the challenge',
        effects: [{ stat: 'courage', delta: 2 }],
        chainedEventId: 'event2'
      },
      {
        id: 'choice2',
        text: 'Decline the challenge',
        effects: [{ stat: 'safety', delta: 1 }]
      }
    ];

    mockEvent = new Event(
      'evt_00123',
      'opportunity',
      'Test Event',
      'This is a test event description',
      10,
      20,
      mockChoices,
      ['test', 'opportunity'],
      0.8
    );
  });

  describe('Constructor', () => {
    it('should create an event with valid data', () => {
      expect(mockEvent.eventId).toBe('evt_00123');
      expect(mockEvent.type).toBe('opportunity');
      expect(mockEvent.title).toBe('Test Event');
      expect(mockEvent.description).toBe('This is a test event description');
      expect(mockEvent.minAge).toBe(10);
      expect(mockEvent.maxAge).toBe(20);
      expect(mockEvent.choices).toEqual(mockChoices);
      expect(mockEvent.tags).toEqual(['test', 'opportunity']);
      expect(mockEvent.branchWeight).toBe(0.8);
    });

    it('should set default values correctly', () => {
      const eventWithDefaults = new Event(
        'evt_00456',
        'milestone',
        'Default Event',
        'Description',
        0,
        100,
        mockChoices
      );
      
      expect(eventWithDefaults.minAge).toBe(0);
      expect(eventWithDefaults.maxAge).toBe(100);
      expect(eventWithDefaults.choices).toEqual(mockChoices);
      expect(eventWithDefaults.tags).toEqual([]);
      expect(eventWithDefaults.branchWeight).toBe(1.0);
    });
  });

  describe('canTriggerAt', () => {
    it('should return true for valid age', () => {
      expect(mockEvent.canTriggerAt(15)).toBe(true);
      expect(mockEvent.canTriggerAt(10)).toBe(true);
      expect(mockEvent.canTriggerAt(20)).toBe(true);
    });

    it('should return false for invalid age', () => {
      expect(mockEvent.canTriggerAt(9)).toBe(false);
      expect(mockEvent.canTriggerAt(21)).toBe(false);
    });
  });

  describe('getSelectionScore', () => {
    it('should calculate selection score based on branch weight', () => {
      const score = mockEvent.getSelectionScore();
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should return different scores for different events', () => {
      const event2 = new Event(
        'evt_00789',
        'random',
        'Event 2',
        'Description',
        0,
        100,
        mockChoices,
        [],
        0.5
      );
      
      const score1 = mockEvent.getSelectionScore();
      const score2 = event2.getSelectionScore();
      expect(score1).not.toBe(score2);
    });
  });

  describe('validation', () => {
    it('should validate event ID', () => {
      expect(() => new Event('', 'milestone', 'Title', 'Description', 0, 100, mockChoices)).toThrow();
    });

    it('should validate title', () => {
      expect(() => new Event('evt_001', 'milestone', '', 'Description', 0, 100, mockChoices)).toThrow();
    });

    it('should validate age range', () => {
      expect(() => new Event('evt_001', 'milestone', 'Title', 'Description', 20, 10, mockChoices)).toThrow();
    });

    it('should validate choices array', () => {
      const invalidChoices = [
        { id: 'choice1', text: 'Choice 1' } as Choice
      ];
      
      expect(() => new Event('evt_001', 'milestone', 'Title', 'Description', 0, 100, invalidChoices)).toThrow();
    });
  });

  describe('utility methods', () => {
    it('should check if event has tag', () => {
      expect(mockEvent.hasTag('test')).toBe(true);
      expect(mockEvent.hasTag('nonexistent')).toBe(false);
    });

    it('should check if event has type', () => {
      expect(mockEvent.hasType('opportunity')).toBe(true);
      expect(mockEvent.hasType('milestone')).toBe(false);
    });

    it('should get affected stats', () => {
      const affectedStats = mockEvent.getAffectedStats();
      expect(affectedStats).toContain('courage');
      expect(affectedStats).toContain('safety');
    });

    it('should get event summary', () => {
      const summary = mockEvent.getSummary();
      expect(summary).toContain('Test Event');
      expect(summary).toContain('opportunity');
      expect(summary).toContain('2 choices');
    });
  });

  describe('static factory methods', () => {
    it('should create milestone event', () => {
      const milestoneEvent = Event.createMilestone(
        'evt_00100',
        'Graduation',
        'You graduate from high school',
        18,
        mockChoices,
        ['education', 'milestone']
      );
      
      expect(milestoneEvent.type).toBe('milestone');
      expect(milestoneEvent.minAge).toBe(18);
      expect(milestoneEvent.maxAge).toBe(18);
      expect(milestoneEvent.branchWeight).toBe(1.0);
    });

    it('should create random event', () => {
      const randomEvent = Event.createRandom(
        'evt_00200',
        'Chance Encounter',
        'You meet someone interesting',
        0,
        100,
        mockChoices,
        ['random', 'encounter'],
        2.0
      );
      
      expect(randomEvent.type).toBe('random');
      expect(randomEvent.branchWeight).toBe(0.8);
      expect(randomEvent.rarityFactor).toBe(2.0);
    });
  });
}); 