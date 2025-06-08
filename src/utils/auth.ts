import CryptoJS from 'crypto-js';
import { User } from '@/types';
import { UserService } from '@/db/services';

/**
 * Hash password using SHA-256
 */
export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Generate a session token
 */
export function generateSessionToken(): string {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

/**
 * Authenticate user with username/email and password
 */
export function authenticateUser(
  usernameOrEmail: string,
  password: string
): User | null {
  // Find user by username or email
  let user = UserService.findByUsername(usernameOrEmail);
  if (!user) {
    user = UserService.findByEmail(usernameOrEmail);
  }

  if (!user) {
    return null;
  }

  // Check if user is active
  if (!user.is_active) {
    throw new Error('User account is deactivated');
  }

  // Verify password
  if (!verifyPassword(password, user.password_hash)) {
    return null;
  }

  return user;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  // More comprehensive email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check basic format
  if (!emailRegex.test(email)) {
    return false;
  }

  // Check for consecutive dots
  if (email.includes('..')) {
    return false;
  }

  // Check for leading/trailing dots in local part
  const [localPart] = email.split('@');
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }

  return true;
}

/**
 * Validate username format
 */
export function validateUsername(username: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username.length > 20) {
    errors.push('Username must be no more than 20 characters long');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
