import { Event, Choice } from '../../Core/Entities/Event';

export const createMockChoice = (overrides: Partial<Choice> = {}): Choice => {
  const defaultChoice: Choice = {
    id: 'choice1',
    text: 'Default choice text',
    effects: [{ stat: 'test_stat', delta: 1 }]
  };
  
  return Object.assign(defaultChoice, overrides);
};

export const createMockEvent = (overrides: Partial<Event> = {}): Event => {
  const defaultChoices: Choice[] = [
    createMockChoice({ id: 'choice1', text: 'First choice' }),
    createMockChoice({ id: 'choice2', text: 'Second choice' })
  ];

  const defaultEvent = new Event(
    'evt_00123',
    'milestone',
    'Test Event',
    'This is a test event description',
    0,
    100,
    defaultChoices,
    ['test', 'milestone'],
    1.0
  );
  
  return Object.assign(defaultEvent, overrides);
};

export const createMockEvents = (count: number): Event[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockEvent({
      eventId: `evt_00${index + 100}`,
      title: `Test Event ${index + 1}`,
      description: `Description for event ${index + 1}`,
      minAge: index * 10,
      maxAge: (index + 1) * 10,
      tags: [`tag${index + 1}`, 'test']
    })
  );
};

export const mockEventData = {
  valid: {
    eventId: 'evt_00100',
    type: 'milestone' as const,
    title: 'Valid Event',
    description: 'This is a valid event description that meets the minimum length requirement',
    minAge: 10,
    maxAge: 20,
    choices: [
      {
        id: 'choice1',
        text: 'First choice',
        effects: [{ stat: 'courage', delta: 2 }]
      },
      {
        id: 'choice2',
        text: 'Second choice',
        effects: [{ stat: 'wisdom', delta: 1 }]
      }
    ],
    tags: ['test', 'milestone'],
    branchWeight: 1.0
  },
  invalid: {
    eventId: 'evt_001', // Too short
    type: 'milestone' as const,
    title: '', // Empty title
    description: 'Short', // Too short description
    minAge: 20,
    maxAge: 10, // Invalid age range
    choices: [
      {
        id: 'choice1',
        text: 'Choice without effects'
      }
    ] as Choice[],
    tags: [],
    branchWeight: 1.0
  }
};

export const mockEventResponses = {
  milestone: {
    id: 'event_1',
    eventId: 'evt_00100',
    type: 'milestone',
    title: 'Graduation',
    description: 'You graduate from high school',
    minAge: 18,
    maxAge: 18,
    choices: [
      {
        id: 'choice1',
        text: 'Accept diploma',
        effects: [{ stat: 'education', delta: 3 }]
      },
      {
        id: 'choice2',
        text: 'Give speech',
        effects: [{ stat: 'charisma', delta: 2 }]
      }
    ],
    tags: ['education', 'milestone'],
    branchWeight: 1.0,
    rarityFactor: 1.0,
    source: 'scripted',
    prerequisites: null,
    createdAt: new Date(),
    isActive: true
  },
  random: {
    id: 'event_2',
    eventId: 'evt_00200',
    type: 'random',
    title: 'Chance Encounter',
    description: 'You meet someone interesting on the street',
    minAge: 0,
    maxAge: 100,
    choices: [
      {
        id: 'choice1',
        text: 'Greet them',
        effects: [{ stat: 'social', delta: 1 }]
      },
      {
        id: 'choice2',
        text: 'Ignore them',
        effects: [{ stat: 'stealth', delta: 1 }]
      }
    ],
    tags: ['random', 'social'],
    branchWeight: 0.8,
    rarityFactor: 1.5,
    source: 'scripted',
    prerequisites: null,
    createdAt: new Date(),
    isActive: true
  }
}; 