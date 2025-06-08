import { db } from './database';
import type { User, Product, Category, Customer, Supplier } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to convert SQLite integers to booleans
function convertSqliteBoolean(obj: any): any {
  if (!obj) return obj;

  const converted = { ...obj };
  // Convert is_active from integer to boolean
  if (typeof converted.is_active === 'number') {
    converted.is_active = Boolean(converted.is_active);
  }
  return converted;
}

// User CRUD operations
export class UserService {
  static async create(
    userData: Omit<User, 'id' | 'created_at' | 'updated_at'>
  ): Promise<User> {
    const id = uuidv4();
    const now = new Date().toISOString();

    db.run(
      `
      INSERT INTO users (id, username, email, password_hash, full_name, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        id,
        userData.username,
        userData.email,
        userData.password_hash,
        userData.full_name,
        userData.role || 'user',
        userData.is_active !== false,
        now,
        now,
      ]
    );

    return this.findById(id)!;
  }
  static findById(id: string): User | null {
    const user = db.get('SELECT * FROM users WHERE id = ?', [id]);
    return user ? convertSqliteBoolean(user) : null;
  }
  static findByUsername(username: string): User | null {
    const user = db.get('SELECT * FROM users WHERE username = ?', [username]);
    return user ? convertSqliteBoolean(user) : null;
  }

  static findByEmail(email: string): User | null {
    const user = db.get('SELECT * FROM users WHERE email = ?', [email]);
    return user ? convertSqliteBoolean(user) : null;
  }

  static findAll(): User[] {
    const users = db.all('SELECT * FROM users ORDER BY created_at DESC');
    return users.map(convertSqliteBoolean);
  }

  static update(
    id: string,
    userData: Partial<Omit<User, 'id' | 'created_at'>>
  ): boolean {
    const now = new Date().toISOString();
    const fields = Object.keys(userData).filter(
      (key) => key !== 'id' && key !== 'created_at'
    );
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => (userData as any)[field]);

    db.run(
      `
      UPDATE users 
      SET ${setClause}, updated_at = ?
      WHERE id = ?
    `,
      [...values, now, id]
    );

    return true;
  }

  static delete(id: string): boolean {
    db.run('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }

  static deactivate(id: string): boolean {
    return this.update(id, { is_active: false });
  }
}

// Category CRUD operations
export class CategoryService {
  static async create(
    categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Category> {
    const id = uuidv4();
    const now = new Date().toISOString();

    db.run(
      `
      INSERT INTO categories (id, name, description, parent_id, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        id,
        categoryData.name,
        categoryData.description || null,
        categoryData.parent_id || null,
        categoryData.is_active !== false,
        now,
        now,
      ]
    );

    return this.findById(id)!;
  }

  static findById(id: string): Category | null {
    return db.get('SELECT * FROM categories WHERE id = ?', [id]);
  }

  static findAll(): Category[] {
    return db.all('SELECT * FROM categories ORDER BY name');
  }

  static findByParentId(parentId: string | null): Category[] {
    if (parentId) {
      return db.all(
        'SELECT * FROM categories WHERE parent_id = ? ORDER BY name',
        [parentId]
      );
    } else {
      return db.all(
        'SELECT * FROM categories WHERE parent_id IS NULL ORDER BY name'
      );
    }
  }

  static findActive(): Category[] {
    return db.all('SELECT * FROM categories WHERE is_active = 1 ORDER BY name');
  }

  static update(
    id: string,
    categoryData: Partial<Omit<Category, 'id' | 'created_at'>>
  ): boolean {
    const now = new Date().toISOString();
    const fields = Object.keys(categoryData).filter(
      (key) => key !== 'id' && key !== 'created_at'
    );
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => (categoryData as any)[field]);

    db.run(
      `
      UPDATE categories 
      SET ${setClause}, updated_at = ?
      WHERE id = ?
    `,
      [...values, now, id]
    );

    return true;
  }

  static delete(id: string): boolean {
    // Check if category has children or products
    const hasChildren = db.get(
      'SELECT COUNT(*) as count FROM categories WHERE parent_id = ?',
      [id]
    );
    const hasProducts = db.get(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [id]
    );

    if (hasChildren?.count > 0 || hasProducts?.count > 0) {
      throw new Error(
        'Cannot delete category that has subcategories or products'
      );
    }

    db.run('DELETE FROM categories WHERE id = ?', [id]);
    return true;
  }
}

// Product CRUD operations
export class ProductService {
  static async create(
    productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Product> {
    const id = uuidv4();
    const now = new Date().toISOString();

    db.run(
      `
      INSERT INTO products (id, name, description, sku, barcode, category_id, purchase_price, selling_price, stock_quantity, min_stock_level, unit, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        id,
        productData.name,
        productData.description || null,
        productData.sku || null,
        productData.barcode || null,
        productData.category_id || null,
        productData.purchase_price || 0,
        productData.selling_price,
        productData.stock_quantity || 0,
        productData.min_stock_level || 0,
        productData.unit || 'pcs',
        productData.is_active !== false,
        now,
        now,
      ]
    );

    return this.findById(id)!;
  }

  static findById(id: string): Product | null {
    return db.get(
      `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `,
      [id]
    );
  }

  static findBySku(sku: string): Product | null {
    return db.get(
      `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.sku = ?
    `,
      [sku]
    );
  }

  static findByBarcode(barcode: string): Product | null {
    return db.get(
      `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.barcode = ?
    `,
      [barcode]
    );
  }

  static findAll(): Product[] {
    return db.all(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.name
    `);
  }

  static findActive(): Product[] {
    return db.all(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = 1 
      ORDER BY p.name
    `);
  }

  static findByCategory(categoryId: string): Product[] {
    return db.all(
      `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.category_id = ? 
      ORDER BY p.name
    `,
      [categoryId]
    );
  }

  static findLowStock(): Product[] {
    return db.all(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.stock_quantity <= p.min_stock_level AND p.is_active = 1
      ORDER BY p.stock_quantity ASC
    `);
  }

  static search(query: string): Product[] {
    const searchTerm = `%${query}%`;
    return db.all(
      `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE (p.name LIKE ? OR p.sku LIKE ? OR p.barcode LIKE ?) AND p.is_active = 1
      ORDER BY p.name
    `,
      [searchTerm, searchTerm, searchTerm]
    );
  }

  static update(
    id: string,
    productData: Partial<Omit<Product, 'id' | 'created_at'>>
  ): boolean {
    const now = new Date().toISOString();
    const fields = Object.keys(productData).filter(
      (key) => key !== 'id' && key !== 'created_at' && key !== 'category_name'
    );
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => (productData as any)[field]);

    db.run(
      `
      UPDATE products 
      SET ${setClause}, updated_at = ?
      WHERE id = ?
    `,
      [...values, now, id]
    );

    return true;
  }

  static updateStock(
    id: string,
    quantity: number,
    operation: 'add' | 'subtract' | 'set' = 'set'
  ): boolean {
    if (operation === 'set') {
      return this.update(id, { stock_quantity: quantity });
    } else if (operation === 'add') {
      db.run(
        'UPDATE products SET stock_quantity = stock_quantity + ?, updated_at = ? WHERE id = ?',
        [quantity, new Date().toISOString(), id]
      );
    } else if (operation === 'subtract') {
      db.run(
        'UPDATE products SET stock_quantity = stock_quantity - ?, updated_at = ? WHERE id = ?',
        [quantity, new Date().toISOString(), id]
      );
    }
    return true;
  }

  static delete(id: string): boolean {
    db.run('DELETE FROM products WHERE id = ?', [id]);
    return true;
  }
}

// Customer CRUD operations
export class CustomerService {
  static async create(
    customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Customer> {
    const id = uuidv4();
    const now = new Date().toISOString();

    db.run(
      `
      INSERT INTO customers (id, name, email, phone, address, city, postal_code, customer_type, credit_limit, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        id,
        customerData.name,
        customerData.email || null,
        customerData.phone || null,
        customerData.address || null,
        customerData.city || null,
        customerData.postal_code || null,
        customerData.customer_type || 'regular',
        customerData.credit_limit || 0,
        customerData.is_active !== false,
        now,
        now,
      ]
    );

    return this.findById(id)!;
  }

  static findById(id: string): Customer | null {
    return db.get('SELECT * FROM customers WHERE id = ?', [id]);
  }

  static findByPhone(phone: string): Customer | null {
    return db.get('SELECT * FROM customers WHERE phone = ?', [phone]);
  }

  static findByEmail(email: string): Customer | null {
    return db.get('SELECT * FROM customers WHERE email = ?', [email]);
  }

  static findAll(): Customer[] {
    return db.all('SELECT * FROM customers ORDER BY name');
  }

  static findActive(): Customer[] {
    return db.all('SELECT * FROM customers WHERE is_active = 1 ORDER BY name');
  }

  static search(query: string): Customer[] {
    const searchTerm = `%${query}%`;
    return db.all(
      `
      SELECT * FROM customers 
      WHERE (name LIKE ? OR phone LIKE ? OR email LIKE ?) AND is_active = 1
      ORDER BY name
    `,
      [searchTerm, searchTerm, searchTerm]
    );
  }

  static update(
    id: string,
    customerData: Partial<Omit<Customer, 'id' | 'created_at'>>
  ): boolean {
    const now = new Date().toISOString();
    const fields = Object.keys(customerData).filter(
      (key) => key !== 'id' && key !== 'created_at'
    );
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => (customerData as any)[field]);

    db.run(
      `
      UPDATE customers 
      SET ${setClause}, updated_at = ?
      WHERE id = ?
    `,
      [...values, now, id]
    );

    return true;
  }

  static delete(id: string): boolean {
    db.run('DELETE FROM customers WHERE id = ?', [id]);
    return true;
  }
}

// Supplier CRUD operations
export class SupplierService {
  static async create(
    supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Supplier> {
    const id = uuidv4();
    const now = new Date().toISOString();

    db.run(
      `
      INSERT INTO suppliers (id, name, contact_person, email, phone, address, city, postal_code, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        id,
        supplierData.name,
        supplierData.contact_person || null,
        supplierData.email || null,
        supplierData.phone || null,
        supplierData.address || null,
        supplierData.city || null,
        supplierData.postal_code || null,
        supplierData.is_active !== false,
        now,
        now,
      ]
    );

    return this.findById(id)!;
  }

  static findById(id: string): Supplier | null {
    return db.get('SELECT * FROM suppliers WHERE id = ?', [id]);
  }

  static findAll(): Supplier[] {
    return db.all('SELECT * FROM suppliers ORDER BY name');
  }

  static findActive(): Supplier[] {
    return db.all('SELECT * FROM suppliers WHERE is_active = 1 ORDER BY name');
  }

  static search(query: string): Supplier[] {
    const searchTerm = `%${query}%`;
    return db.all(
      `
      SELECT * FROM suppliers 
      WHERE (name LIKE ? OR contact_person LIKE ? OR phone LIKE ?) AND is_active = 1
      ORDER BY name
    `,
      [searchTerm, searchTerm, searchTerm]
    );
  }

  static update(
    id: string,
    supplierData: Partial<Omit<Supplier, 'id' | 'created_at'>>
  ): boolean {
    const now = new Date().toISOString();
    const fields = Object.keys(supplierData).filter(
      (key) => key !== 'id' && key !== 'created_at'
    );
    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    const values = fields.map((field) => (supplierData as any)[field]);

    db.run(
      `
      UPDATE suppliers 
      SET ${setClause}, updated_at = ?
      WHERE id = ?
    `,
      [...values, now, id]
    );

    return true;
  }

  static delete(id: string): boolean {
    db.run('DELETE FROM suppliers WHERE id = ?', [id]);
    return true;
  }
}
