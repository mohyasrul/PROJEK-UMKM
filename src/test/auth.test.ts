import { describe, test, expect, beforeEach, beforeAll } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  authenticateUser,
  validatePassword,
  validateEmail,
  validateUsername,
} from '../utils/auth';
import { UserService } from '../db/services';
import { db } from '../db';

describe('Authentication Utils', () => {
  beforeAll(async () => {
    // Initialize database before all tests
    await db.initialize();
  });

  beforeEach(async () => {
    // Reset database before each test
    await db.clearDatabase();
  });

  describe('Password Hashing', () => {
    test('should hash password consistently', () => {
      const password = 'testPassword123';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(password);
    });

    test('should verify password correctly', () => {
      const password = 'testPassword123';
      const hash = hashPassword(password);

      expect(verifyPassword(password, hash)).toBe(true);
      expect(verifyPassword('wrongPassword', hash)).toBe(false);
    });
  });

  describe('Session Token', () => {
    test('should generate unique session tokens', () => {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();

      expect(token1).not.toBe(token2);
      expect(token1.length).toBeGreaterThan(0);
      expect(token2.length).toBeGreaterThan(0);
    });
  });

  describe('User Authentication', () => {
    beforeEach(async () => {
      // Create test user
      await UserService.create({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: hashPassword('password123'),
        full_name: 'Test User',
        role: 'user',
        is_active: true,
      });
    });
    test('should authenticate user with username', () => {
      const user = authenticateUser('testuser', 'password123');
      expect(user).toBeTruthy();
      expect(user?.username).toBe('testuser');
    });

    test('should authenticate user with email', () => {
      const user = authenticateUser('test@example.com', 'password123');
      expect(user).toBeTruthy();
      expect(user?.email).toBe('test@example.com');
    });

    test('should return null for wrong password', () => {
      const user = authenticateUser('testuser', 'wrongpassword');
      expect(user).toBeNull();
    });

    test('should return null for non-existent user', () => {
      const user = authenticateUser('nonexistent', 'password123');
      expect(user).toBeNull();
    });
    test('should throw error for inactive user', async () => {
      // Get the created user to get the ID
      const createdUser = UserService.findByUsername('testuser');
      if (!createdUser) throw new Error('Test user not found');

      // Deactivate user using the ID
      UserService.deactivate(createdUser.id);

      expect(() => {
        authenticateUser('testuser', 'password123');
      }).toThrow('User account is deactivated');
    });
  });

  describe('Validation Functions', () => {
    describe('Password Validation', () => {
      test('should validate strong password', () => {
        const result = validatePassword('StrongPass123');
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('should reject weak password', () => {
        const result = validatePassword('weak');
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });

      test('should require minimum length', () => {
        const result = validatePassword('Ab1');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(
          'Password must be at least 6 characters long'
        );
      });

      test('should require uppercase letter', () => {
        const result = validatePassword('password123');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(
          'Password must contain at least one uppercase letter'
        );
      });

      test('should require lowercase letter', () => {
        const result = validatePassword('PASSWORD123');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(
          'Password must contain at least one lowercase letter'
        );
      });

      test('should require number', () => {
        const result = validatePassword('Password');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(
          'Password must contain at least one number'
        );
      });
    });

    describe('Email Validation', () => {
      test('should validate correct email', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('user.name@domain.co.id')).toBe(true);
      });

      test('should reject invalid email', () => {
        expect(validateEmail('invalid-email')).toBe(false);
        expect(validateEmail('test@')).toBe(false);
        expect(validateEmail('@domain.com')).toBe(false);
        expect(validateEmail('test..test@domain.com')).toBe(false);
      });
    });

    describe('Username Validation', () => {
      test('should validate correct username', () => {
        const result = validateUsername('validuser123');
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('should reject too short username', () => {
        const result = validateUsername('ab');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(
          'Username must be at least 3 characters long'
        );
      });

      test('should reject too long username', () => {
        const result = validateUsername('a'.repeat(21));
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(
          'Username must be no more than 20 characters long'
        );
      });

      test('should reject invalid characters', () => {
        const result = validateUsername('user@name');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(
          'Username can only contain letters, numbers, and underscores'
        );
      });
    });
  });
});
