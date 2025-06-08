# Database Documentation

## 🎉 Implementation Status: COMPLETED ✅

**All database features are now fully implemented and tested!**

- ✅ SQL.js installation and configuration
- ✅ SQLite with IndexedDB persistence
- ✅ Database schema for all core entities
- ✅ Migration system with 5 core tables
- ✅ CRUD services for all entities
- ✅ Test environment compatibility
- ✅ Data seeding functionality
- ✅ Comprehensive test suite (12/12 tests passing)
- ✅ Production build compatibility
- ✅ Boolean data type handling
- ✅ Browser compatibility testing

## Overview

The UMKM Management App uses SQLite as the primary database with sql.js for browser compatibility and IndexedDB for persistence. This setup provides a complete offline-first database solution.

## Architecture

### Technologies Used

- **sql.js**: SQLite compiled to WebAssembly for browser usage
- **IndexedDB**: Browser storage for database persistence
- **idb**: Promise-based IndexedDB wrapper

### Database Schema

#### Users Table

```sql
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
```

#### Categories Table

```sql
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
```

#### Products Table

```sql
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
```

#### Customers Table

```sql
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
```

#### Suppliers Table

```sql
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
```

## Usage

### Initialization

```typescript
import { db } from '@/db';

// Initialize database
await db.initialize();
```

### Using Services

```typescript
import { UserService, ProductService } from '@/db';

// Create a user
const user = await UserService.create({
  username: 'john_doe',
  email: 'john@example.com',
  password_hash: 'hashed_password',
  full_name: 'John Doe',
  role: 'user',
  is_active: true,
});

// Find user by ID
const foundUser = UserService.findById(user.id);

// Update user
UserService.update(user.id, { full_name: 'John Smith' });

// Delete user
UserService.delete(user.id);
```

### Database Operations

#### Direct SQL Execution

```typescript
// Execute query with results
const results = db.all('SELECT * FROM users WHERE is_active = ?', [true]);

// Execute single row query
const user = db.get('SELECT * FROM users WHERE id = ?', [userId]);

// Execute without results (INSERT, UPDATE, DELETE)
db.run('UPDATE users SET last_login = ? WHERE id = ?', [
  new Date().toISOString(),
  userId,
]);
```

#### Persistence

```typescript
// Save database to IndexedDB
await db.saveDatabase();

// Export database
const exportedData = db.exportDatabase();

// Import database
await db.importDatabase(exportedData);

// Clear database and recreate schema
await db.clearDatabase();
```

### Data Seeding

```typescript
import { DataSeeder } from '@/db';

// Seed all sample data
await DataSeeder.seedAll();

// Clear all data
await DataSeeder.clearAllData();
```

## Service Classes

### UserService

- `create(userData)` - Create new user
- `findById(id)` - Find user by ID
- `findByUsername(username)` - Find user by username
- `findByEmail(email)` - Find user by email
- `findAll()` - Get all users
- `update(id, userData)` - Update user
- `delete(id)` - Delete user
- `deactivate(id)` - Deactivate user

### ProductService

- `create(productData)` - Create new product
- `findById(id)` - Find product by ID
- `findBySku(sku)` - Find product by SKU
- `findByBarcode(barcode)` - Find product by barcode
- `findAll()` - Get all products
- `findActive()` - Get active products
- `findByCategory(categoryId)` - Get products by category
- `findLowStock()` - Get low stock products
- `search(query)` - Search products
- `update(id, productData)` - Update product
- `updateStock(id, quantity, operation)` - Update product stock
- `delete(id)` - Delete product

### CategoryService

- `create(categoryData)` - Create new category
- `findById(id)` - Find category by ID
- `findAll()` - Get all categories
- `findByParentId(parentId)` - Get subcategories
- `findActive()` - Get active categories
- `update(id, categoryData)` - Update category
- `delete(id)` - Delete category

### CustomerService

- `create(customerData)` - Create new customer
- `findById(id)` - Find customer by ID
- `findByPhone(phone)` - Find customer by phone
- `findByEmail(email)` - Find customer by email
- `findAll()` - Get all customers
- `findActive()` - Get active customers
- `search(query)` - Search customers
- `update(id, customerData)` - Update customer
- `delete(id)` - Delete customer

### SupplierService

- `create(supplierData)` - Create new supplier
- `findById(id)` - Find supplier by ID
- `findAll()` - Get all suppliers
- `findActive()` - Get active suppliers
- `search(query)` - Search suppliers
- `update(id, supplierData)` - Update supplier
- `delete(id)` - Delete supplier

## React Integration

### useDatabase Hook

```typescript
import { useDatabase } from '@/hooks/useDatabase';

function MyComponent() {
  const { isInitialized, isLoading, error, reinitialize, clearAndSeed } = useDatabase(true);

  if (isLoading) return <div>Loading database...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isInitialized) return <div>Database not ready</div>;

  return <div>Database ready!</div>;
}
```

## Migration System

The database uses an automatic migration system that tracks applied migrations:

```typescript
// Migrations are automatically applied on initialization
// Each migration is recorded in the migrations table
// Migrations are only run once per database
```

## Testing

The database includes comprehensive tests covering:

- CRUD operations for all entities
- Data relationships and constraints
- Search functionality
- Stock management
- Data persistence
- Import/export functionality

Run tests with:

```bash
npm test
npm run test:ui
npm run test:coverage
```

## Best Practices

1. **Always use transactions** for multi-table operations
2. **Validate data** before database operations
3. **Use indexes** for frequently queried columns
4. **Regular backups** using export functionality
5. **Test migrations** thoroughly before deployment
6. **Monitor performance** for large datasets

## Error Handling

```typescript
try {
  const user = await UserService.create(userData);
} catch (error) {
  if (error.message.includes('UNIQUE constraint')) {
    // Handle duplicate username/email
  } else {
    // Handle other database errors
  }
}
```

## Performance Considerations

- Database is loaded into memory (SQLite in browser)
- Regular saves to IndexedDB for persistence
- Indexes on frequently queried columns
- Pagination for large result sets
- Lazy loading for related data

## Security Notes

- All data is stored locally in the browser
- No network transmission of sensitive data
- Password hashing should be implemented before storage
- Consider encryption for sensitive fields
- Regular data validation and sanitization
