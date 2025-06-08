import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import {
  db,
  UserService,
  CategoryService,
  ProductService,
  CustomerService,
  SupplierService,
  DataSeeder,
} from '@/db';

// Database tests - now enabled
describe('Database Operations', () => {
  beforeAll(async () => {
    // Initialize database before running tests
    await db.initialize();
  });

  afterAll(async () => {
    // Clean up after tests
    await db.clearDatabase();
  });

  describe('User Service', () => {
    test('should create and retrieve user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        full_name: 'Test User',
        role: 'user' as const,
        is_active: true,
      };

      const user = await UserService.create(userData);
      expect(user.id).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);

      const foundUser = UserService.findById(user.id);
      expect(foundUser).toBeTruthy();
      expect(foundUser?.username).toBe(userData.username);

      const foundByUsername = UserService.findByUsername(userData.username);
      expect(foundByUsername).toBeTruthy();
      expect(foundByUsername?.id).toBe(user.id);
    });

    test('should update user', async () => {
      const user = await UserService.create({
        username: 'updatetest',
        email: 'update@test.com',
        password_hash: 'hash',
        full_name: 'Update Test',
        role: 'user',
        is_active: true,
      });

      const success = UserService.update(user.id, {
        full_name: 'Updated Name',
        is_active: false,
      });

      expect(success).toBe(true);

      const updatedUser = UserService.findById(user.id);
      expect(updatedUser?.full_name).toBe('Updated Name');
      expect(updatedUser?.is_active).toBe(false);
    });
  });

  describe('Category Service', () => {
    test('should create category hierarchy', async () => {
      const parentCategory = await CategoryService.create({
        name: 'Electronics',
        description: 'Electronic products',
        is_active: true,
      });

      const childCategory = await CategoryService.create({
        name: 'Smartphones',
        description: 'Mobile phones',
        parent_id: parentCategory.id,
        is_active: true,
      });

      expect(parentCategory.id).toBeDefined();
      expect(childCategory.parent_id).toBe(parentCategory.id);

      const children = CategoryService.findByParentId(parentCategory.id);
      expect(children).toHaveLength(1);
      expect(children[0].id).toBe(childCategory.id);
    });
  });

  describe('Product Service', () => {
    test('should create and manage products', async () => {
      const category = await CategoryService.create({
        name: 'Test Category',
        is_active: true,
      });

      const productData = {
        name: 'Test Product',
        description: 'A test product',
        sku: 'TEST-001',
        barcode: '1234567890123',
        category_id: category.id,
        purchase_price: 1000,
        selling_price: 1500,
        stock_quantity: 100,
        min_stock_level: 10,
        unit: 'pcs',
        is_active: true,
      };

      const product = await ProductService.create(productData);
      expect(product.id).toBeDefined();
      expect(product.name).toBe(productData.name);
      expect(product.stock_quantity).toBe(100);

      // Test stock updates
      ProductService.updateStock(product.id, 10, 'subtract');
      const updatedProduct = ProductService.findById(product.id);
      expect(updatedProduct?.stock_quantity).toBe(90);

      // Test search
      const searchResults = ProductService.search('Test');
      expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults.some((p) => p.id === product.id)).toBe(true);

      // Test low stock detection
      ProductService.updateStock(product.id, 5, 'set');
      const lowStockProducts = ProductService.findLowStock();
      expect(lowStockProducts.some((p) => p.id === product.id)).toBe(true);
    });
  });

  describe('Customer Service', () => {
    test('should manage customers', async () => {
      const customerData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
        address: '123 Main St',
        city: 'Jakarta',
        customer_type: 'regular' as const,
        credit_limit: 1000000,
        is_active: true,
      };

      const customer = await CustomerService.create(customerData);
      expect(customer.id).toBeDefined();
      expect(customer.name).toBe(customerData.name);

      const foundByPhone = CustomerService.findByPhone(customerData.phone!);
      expect(foundByPhone?.id).toBe(customer.id);

      const searchResults = CustomerService.search('John');
      expect(searchResults.length).toBeGreaterThan(0);
    });
  });

  describe('Supplier Service', () => {
    test('should manage suppliers', async () => {
      const supplierData = {
        name: 'Test Supplier',
        contact_person: 'Jane Smith',
        email: 'supplier@test.com',
        phone: '021234567890',
        address: '456 Business Ave',
        is_active: true,
      };

      const supplier = await SupplierService.create(supplierData);
      expect(supplier.id).toBeDefined();
      expect(supplier.name).toBe(supplierData.name);

      const allSuppliers = SupplierService.findAll();
      expect(allSuppliers.some((s) => s.id === supplier.id)).toBe(true);
    });
  });

  describe('Data Seeder', () => {
    test('should seed sample data', async () => {
      await DataSeeder.seedAll();

      const users = UserService.findAll();
      expect(users.length).toBeGreaterThan(0);

      const categories = CategoryService.findAll();
      expect(categories.length).toBeGreaterThan(0);

      const products = ProductService.findAll();
      expect(products.length).toBeGreaterThan(0);

      const customers = CustomerService.findAll();
      expect(customers.length).toBeGreaterThan(0);

      const suppliers = SupplierService.findAll();
      expect(suppliers.length).toBeGreaterThan(0);
    });
  });

  describe('Database Persistence', () => {
    test('should persist data to IndexedDB', async () => {
      const userData = {
        username: 'persisttest',
        email: 'persist@test.com',
        password_hash: 'hash',
        full_name: 'Persist Test',
        role: 'user' as const,
        is_active: true,
      };

      const user = await UserService.create(userData);

      // Save database
      await db.saveDatabase();

      // Verify user exists
      const foundUser = UserService.findById(user.id);
      expect(foundUser).toBeTruthy();
    });

    test('should export and import database', async () => {
      // Create test data
      const user = await UserService.create({
        username: 'exporttest',
        email: 'export@test.com',
        password_hash: 'hash',
        full_name: 'Export Test',
        role: 'user',
        is_active: true,
      });

      // Export database
      const exportedData = db.exportDatabase();
      expect(exportedData).toBeInstanceOf(Uint8Array);
      expect(exportedData.length).toBeGreaterThan(0);

      // Clear database
      await db.clearDatabase();

      // Verify data is cleared
      const clearedUsers = UserService.findAll();
      expect(clearedUsers.length).toBe(0);

      // Import database
      await db.importDatabase(exportedData);

      // Verify data is restored
      const restoredUser = UserService.findById(user.id);
      expect(restoredUser).toBeTruthy();
      expect(restoredUser?.username).toBe('exporttest');
    });
  });
});
