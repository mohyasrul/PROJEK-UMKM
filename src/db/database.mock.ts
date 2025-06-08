// Simple mock database for testing - avoids complex SQL.js interface issues

export interface MockQueryResult {
  columns: string[];
  values: any[][];
}

export class MockDatabase {
  private mockData = new Map<string, any[]>();

  constructor() {
    // Pre-populate with some test data
    this.mockData.set('users', [
      {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        is_active: 1,
      },
    ]);
    this.mockData.set('categories', [
      {
        id: '1',
        name: 'Test Category',
        description: 'Test Description',
        is_active: 1,
      },
    ]);
  }

  // Mock exec method - returns array of results
  exec(sql: string, params?: any[]): MockQueryResult[] {
    void params; // Suppress unused warning

    // Simple mock responses based on SQL patterns
    if (sql.includes('SELECT') && sql.includes('users')) {
      return [
        {
          columns: ['id', 'username', 'email', 'is_active'],
          values: [['1', 'testuser', 'test@example.com', 1]],
        },
      ];
    }

    if (sql.includes('SELECT') && sql.includes('categories')) {
      return [
        {
          columns: ['id', 'name', 'description', 'is_active'],
          values: [['1', 'Test Category', 'Test Description', 1]],
        },
      ];
    }

    return [{ columns: [], values: [] }];
  }

  // Mock run method for INSERT/UPDATE/DELETE
  run(sql: string, params?: any[]): void {
    void sql;
    void params; // Suppress unused warnings
    // Mock implementation - just log for debugging
    console.log('Mock run:', sql.substring(0, 50));
  }

  // Mock prepare method - returns a simple statement object
  prepare(sql: string) {
    return {
      run: (params?: any[]) => {
        void params;
        return { changes: 1, lastInsertRowid: 1 };
      },
      get: (params?: any[]) => {
        void params;
        if (sql.includes('users')) {
          return {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            is_active: 1,
          };
        }
        return null;
      },
      all: (params?: any[]) => {
        void params;
        if (sql.includes('users')) {
          return [
            {
              id: '1',
              username: 'testuser',
              email: 'test@example.com',
              is_active: 1,
            },
          ];
        }
        return [];
      },
      step: () => false,
      getAsObject: () => ({}),
      free: () => {},
    };
  }

  // Mock export for database persistence
  export(): Uint8Array {
    return new Uint8Array(0);
  }

  // Mock close method
  close(): void {
    this.mockData.clear();
  }
}

// Factory function to create mock database
export function createMockDatabase(): MockDatabase {
  return new MockDatabase();
}
