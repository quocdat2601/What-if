import { Player } from '../../Core/Entities/Player';

export const createMockPlayer = (overrides: Partial<Player> = {}): Player => {
  const defaultPlayer = new Player('testuser', 'test@example.com');
  
  return Object.assign(defaultPlayer, overrides);
};

export const createMockPlayers = (count: number): Player[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockPlayer({
      username: `user${index + 1}`,
      email: `user${index + 1}@example.com`
    })
  );
};

export const mockPlayerData = {
  valid: {
    username: 'validuser',
    email: 'valid@example.com'
  },
  invalid: {
    username: 'ab', // Too short
    email: 'invalid-email' // Invalid format
  },
  edgeCases: {
    longUsername: 'a'.repeat(51), // Too long
    emptyUsername: '',
    nullEmail: null
  }
};

export const mockPlayerResponses = {
  success: {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: new Date().toISOString(),
    lastLogin: null,
    isActive: true
  },
  inactive: {
    id: '2',
    username: 'inactiveuser',
    email: 'inactive@example.com',
    createdAt: new Date().toISOString(),
    lastLogin: null,
    isActive: false
  }
}; 