// Test setup file for Vitest
import { beforeAll, afterAll } from 'vitest';

// Set test environment
process.env.NODE_ENV = 'test';

// Mock IndexedDB for testing environment
const mockIDBDatabase = {
  createObjectStore: () => ({
    add: () => Promise.resolve(),
    put: () => Promise.resolve(),
    get: () => Promise.resolve(null),
    delete: () => Promise.resolve(),
  }),
  transaction: () => ({
    objectStore: () => mockIDBDatabase.createObjectStore(),
  }),
};

const mockIDB = {
  open: () => Promise.resolve(mockIDBDatabase),
};

beforeAll(() => {
  // Mock global indexedDB if not available in test environment
  if (!global.indexedDB) {
    global.indexedDB = mockIDB as any;
  }

  // Mock WebAssembly if needed
  if (!global.WebAssembly) {
    global.WebAssembly = {
      instantiate: () => Promise.resolve({ instance: { exports: {} } }),
      compile: () => Promise.resolve({}),
    } as any;
  }
});

afterAll(() => {
  // Cleanup if needed
});
