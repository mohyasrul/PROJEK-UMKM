// Database Schema for SQLite
export const DATABASE_SCHEMA = `
-- Users & Authentication
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin', 'manager', 'cashier')) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Categories & Products
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id TEXT,
  FOREIGN KEY (parent_id) REFERENCES categories (id)
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  barcode TEXT UNIQUE,
  price_buy DECIMAL(10,2) NOT NULL,
  price_sell DECIMAL(10,2) NOT NULL,
  stock_minimum INTEGER DEFAULT 0,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE IF NOT EXISTS product_units (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  unit_name TEXT NOT NULL,
  conversion_rate DECIMAL(10,4) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products (id)
);

-- Inventory Management
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL DEFAULT 'main',
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost_basis DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  type TEXT CHECK(type IN ('in', 'out', 'adjustment')) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  reference_id TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products (id)
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  credit_limit DECIMAL(10,2) DEFAULT 0,
  total_purchases DECIMAL(10,2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sales & Orders
CREATE TABLE IF NOT EXISTS sales_orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  total DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  status TEXT CHECK(status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);

CREATE TABLE IF NOT EXISTS sales_order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (order_id) REFERENCES sales_orders (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT CHECK(method IN ('cash', 'card', 'qris', 'transfer')) NOT NULL,
  reference TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES sales_orders (id)
);

-- Financial Accounts
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('asset', 'liability', 'equity', 'revenue', 'expense')) NOT NULL,
  balance DECIMAL(15,2) DEFAULT 0
);

-- Journal Entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY,
  reference TEXT,
  description TEXT,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS journal_items (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  debit DECIMAL(15,2) DEFAULT 0,
  credit DECIMAL(15,2) DEFAULT 0,
  FOREIGN KEY (entry_id) REFERENCES journal_entries (id),
  FOREIGN KEY (account_id) REFERENCES accounts (id)
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  category_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  receipt_url TEXT,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Employees & HR
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  salary DECIMAL(10,2),
  join_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  date DATE NOT NULL,
  time_in TIME,
  time_out TIME,
  FOREIGN KEY (employee_id) REFERENCES employees (id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_sales_orders_date ON sales_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
`;

export const INITIAL_DATA = `
-- Insert default admin user (password: admin123)
INSERT OR IGNORE INTO users (id, username, password_hash, role) 
VALUES ('admin-001', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'admin');

-- Insert default categories
INSERT OR IGNORE INTO categories (id, name) VALUES 
  ('cat-001', 'Electronics'),
  ('cat-002', 'Clothing'),
  ('cat-003', 'Food & Beverage'),
  ('cat-004', 'Books'),
  ('cat-005', 'Health & Beauty');

-- Insert default accounts
INSERT OR IGNORE INTO accounts (id, name, type) VALUES 
  ('acc-001', 'Cash', 'asset'),
  ('acc-002', 'Bank Account', 'asset'),
  ('acc-003', 'Inventory', 'asset'),
  ('acc-004', 'Sales Revenue', 'revenue'),
  ('acc-005', 'Cost of Goods Sold', 'expense');
`;
