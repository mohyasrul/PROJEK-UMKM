import { describe, it, expect } from 'vitest';

describe('Basic Tests', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle strings', () => {
    const message = 'Hello, UMKM App!';
    expect(message).toContain('UMKM');
  });

  it('should work with arrays', () => {
    const items = ['users', 'products', 'categories'];
    expect(items).toHaveLength(3);
    expect(items).toContain('users');
  });
});
