import { Player } from '../../Core/Entities/Player';

describe('Player Entity', () => {
  let player: Player;

  beforeEach(() => {
    player = new Player('testuser', 'test@example.com');
  });

  describe('Constructor', () => {
    it('should create a player with valid data', () => {
      expect(player.username).toBe('testuser');
      expect(player.email).toBe('test@example.com');
      expect(player.isActive).toBe(true);
      expect(player.createdAt).toBeInstanceOf(Date);
      expect(player.id).toBeDefined();
    });

    it('should create a player without email', () => {
      const playerWithoutEmail = new Player('testuser2');
      expect(playerWithoutEmail.email).toBeNull();
    });

    it('should throw error for invalid username', () => {
      expect(() => new Player('')).toThrow();
      expect(() => new Player('ab')).toThrow();
    });
  });

  describe('canStartNewRun', () => {
    it('should return true for active player with valid username', () => {
      expect(player.canStartNewRun()).toBe(true);
    });

    it('should return false for inactive player', () => {
      player.deactivate();
      expect(player.canStartNewRun()).toBe(false);
    });
  });

  describe('updateLastLogin', () => {
    it('should update last login time', () => {
      const beforeUpdate = player.lastLogin;
      player.updateLastLogin();
      expect(player.lastLogin).not.toBe(beforeUpdate);
      expect(player.lastLogin).toBeInstanceOf(Date);
    });
  });

  describe('deactivate and reactivate', () => {
    it('should deactivate player', () => {
      player.deactivate();
      expect(player.isActive).toBe(false);
    });

    it('should reactivate player', () => {
      player.deactivate();
      player.reactivate();
      expect(player.isActive).toBe(true);
    });
  });

  describe('validation', () => {
    it('should validate username length', () => {
      expect(() => new Player('ab')).toThrow();
      expect(() => new Player('abc')).not.toThrow();
      expect(() => new Player('a'.repeat(51))).toThrow();
    });

    it('should validate email format', () => {
      expect(() => new Player('testuser', 'invalid-email')).toThrow();
      expect(() => new Player('testuser', 'valid@email.com')).not.toThrow();
    });
  });
}); 