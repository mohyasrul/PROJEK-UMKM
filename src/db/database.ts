import initSqlJs, { type Database } from 'sql.js';
import { openDB, type DBSchema } from 'idb';

// IndexedDB schema for storing database files
interface UMKMDBSchema extends DBSchema {
  'database-files': {
    key: string;
    value: {
      name: string;
      data: Uint8Array;
      lastModified: number;
    };
  };
}

class DatabaseManager {
  private static instance: DatabaseManager;
  private db: Database | null = null;
  private sqlJs: any = null;
  private idbConnection: any = null;

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  } // Initialize SQL.js and IndexedDB
  async initialize(): Promise<void> {
    try {
      // Check if we're in test environment
      const isTest =
        typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
      if (isTest) {
        // Initialize mock database for testing
        console.log('🧪 Initializing mock database for testing');

        try {
          // Try to use real SQL.js first
          this.sqlJs = await initSqlJs();
          this.db = new this.sqlJs.Database();
        } catch (error) {
          // If WASM loading fails, use our mock database
          console.log('⚠️ Using simplified mock database for testing');
          const { createMockDatabase } = await import('./database.mock');
          this.db = createMockDatabase() as any; // Type assertion to avoid interface conflicts
        }

        await this.runMigrations();
        console.log('✅ Test database initialized successfully');
        return;
      }

      // Initialize SQL.js with proper WASM path handling
      this.sqlJs = await initSqlJs({
        locateFile: (_file: string) => `/sql-wasm.wasm`,
      });

      // Initialize IndexedDB connection
      this.idbConnection = await openDB<UMKMDBSchema>('umkm-database', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('database-files')) {
            db.createObjectStore('database-files');
          }
        },
      });

      // Load existing database or create new one
      await this.loadOrCreateDatabase();

      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
      throw error;
    }
  }

  // Load existing database from IndexedDB or create new one
  private async loadOrCreateDatabase(): Promise<void> {
    try {
      // Try to load existing database
      const savedDb = await this.idbConnection.get('database-files', 'main');

      if (savedDb) {
        // Load existing database
        this.db = new this.sqlJs.Database(savedDb.data);
        console.log('📂 Loaded existing database from IndexedDB');
      } else {
        // Create new database
        this.db = new this.sqlJs.Database();
        console.log('🆕 Created new database');

        // Run initial migrations
        await this.runMigrations();

        // Save the new database
        await this.saveDatabase();
      }
    } catch (error) {
      console.error('❌ Failed to load/create database:', error);
      throw error;
    }
  }
  // Save database to IndexedDB
  async saveDatabase(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    // Skip saving in test environment
    const isTest =
      typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
    if (isTest) {
      console.log('🧪 Skipping database save in test environment');
      return;
    }

    if (!this.idbConnection) {
      throw new Error('IndexedDB connection not initialized');
    }

    try {
      const data = this.db.export();
      await this.idbConnection.put(
        'database-files',
        {
          name: 'main',
          data: data,
          lastModified: Date.now(),
        },
        'main'
      );

      console.log('💾 Database saved to IndexedDB');
    } catch (error) {
      console.error('❌ Failed to save database:', error);
      throw error;
    }
  }

  // Execute SQL query
  exec(sql: string, params?: any[]): any[] {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const stmt = this.db.prepare(sql);
      const results: any[] = [];

      if (params) {
        stmt.bind(params);
      }

      while (stmt.step()) {
        const row = stmt.getAsObject();
        results.push(row);
      }

      stmt.free();
      return results;
    } catch (error) {
      console.error('❌ SQL execution error:', error);
      throw error;
    }
  }

  // Execute SQL without return (INSERT, UPDATE, DELETE)
  run(sql: string, params?: any[]): void {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      if (params) {
        this.db.run(sql, params);
      } else {
        this.db.run(sql);
      }
      // Auto-save after modifications (skip in test environment)
      const isTest =
        typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
      if (!isTest) {
        this.saveDatabase();
      }
    } catch (error) {
      console.error('❌ SQL execution error:', error);
      throw error;
    }
  }

  // Get single row
  get(sql: string, params?: any[]): any | null {
    const results = this.exec(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  // Get all rows
  all(sql: string, params?: any[]): any[] {
    return this.exec(sql, params);
  }

  // Run database migrations
  private async runMigrations(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    console.log('🔄 Running database migrations...');

    // Create migrations table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const migrations = [
      {
        name: '001_create_users_table',
        sql: `
          CREATE TABLE users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT NOT NULL,
            role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user', 'cashier')),
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE INDEX idx_users_username ON users(username);
          CREATE INDEX idx_users_email ON users(email);
        `,
      },
      {
        name: '002_create_categories_table',
        sql: `
          CREATE TABLE categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            parent_id TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (parent_id) REFERENCES categories(id)
          );
          
          CREATE INDEX idx_categories_parent_id ON categories(parent_id);
        `,
      },
      {
        name: '003_create_products_table',
        sql: `
          CREATE TABLE products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            sku TEXT UNIQUE,
            barcode TEXT UNIQUE,
            category_id TEXT,
            purchase_price DECIMAL(15,2) DEFAULT 0,
            selling_price DECIMAL(15,2) NOT NULL,
            stock_quantity INTEGER DEFAULT 0,
            min_stock_level INTEGER DEFAULT 0,
            unit TEXT DEFAULT 'pcs',
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id)
          );
          
          CREATE INDEX idx_products_sku ON products(sku);
          CREATE INDEX idx_products_barcode ON products(barcode);
          CREATE INDEX idx_products_category_id ON products(category_id);
        `,
      },
      {
        name: '004_create_customers_table',
        sql: `
          CREATE TABLE customers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            address TEXT,
            city TEXT,
            postal_code TEXT,
            customer_type TEXT DEFAULT 'regular' CHECK(customer_type IN ('regular', 'vip', 'wholesale')),
            credit_limit DECIMAL(15,2) DEFAULT 0,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
          
          CREATE INDEX idx_customers_phone ON customers(phone);
          CREATE INDEX idx_customers_email ON customers(email);
        `,
      },
      {
        name: '005_create_suppliers_table',
        sql: `
          CREATE TABLE suppliers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            contact_person TEXT,
            email TEXT,
            phone TEXT,
            address TEXT,
            city TEXT,
            postal_code TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `,
      },
    ];

    // Execute migrations
    for (const migration of migrations) {
      const existing = this.get('SELECT * FROM migrations WHERE name = ?', [
        migration.name,
      ]);

      if (!existing) {
        console.log(`⚡ Running migration: ${migration.name}`);

        // Split and execute multiple SQL statements
        const statements = migration.sql.split(';').filter((s) => s.trim());
        for (const statement of statements) {
          if (statement.trim()) {
            this.db.run(statement.trim());
          }
        }

        // Record migration
        this.db.run('INSERT INTO migrations (name) VALUES (?)', [
          migration.name,
        ]);
      }
    }

    console.log('✅ Database migrations completed');
  }

  // Export database for backup
  exportDatabase(): Uint8Array {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db.export();
  }

  // Import database from backup
  async importDatabase(data: Uint8Array): Promise<void> {
    if (!this.sqlJs) {
      throw new Error('SQL.js not initialized');
    }

    this.db = new this.sqlJs.Database(data);
    await this.saveDatabase();
    console.log('📥 Database imported successfully');
  }

  // Clear all data (for development/testing)
  async clearDatabase(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    // Drop all tables
    const tables = this.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);

    for (const table of tables) {
      this.db.run(`DROP TABLE IF EXISTS ${table.name}`);
    }

    // Recreate schema
    await this.runMigrations();
    await this.saveDatabase();

    console.log('🗑️ Database cleared and recreated');
  }
}

// Export singleton instance
export const db = DatabaseManager.getInstance();
export default DatabaseManager;
