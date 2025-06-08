import React, { useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import {
  UserService,
  CategoryService,
  ProductService,
  CustomerService,
  SupplierService,
} from '@/db/services';
import { Button } from '@/components/Button';

export const DatabaseTest: React.FC = () => {
  const { isInitialized, isLoading, error, clearAndSeed } = useDatabase(true);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const runCRUDTests = async () => {
    setTestResults([]);
    addTestResult('🧪 Starting CRUD tests...');

    try {
      // Test Users
      addTestResult('👤 Testing User operations...');
      const user = await UserService.create({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        full_name: 'Test User',
        role: 'user',
        is_active: true,
      });
      addTestResult(`✅ User created: ${user.full_name}`);

      const foundUser = UserService.findById(user.id);
      addTestResult(`✅ User found: ${foundUser?.username}`);

      // Test Categories
      addTestResult('📂 Testing Category operations...');
      const category = await CategoryService.create({
        name: 'Test Category',
        description: 'Test category description',
        is_active: true,
      });
      addTestResult(`✅ Category created: ${category.name}`);

      // Test Products
      addTestResult('📦 Testing Product operations...');
      const product = await ProductService.create({
        name: 'Test Product',
        description: 'Test product description',
        sku: 'TEST-001',
        barcode: '1234567890123',
        category_id: category.id,
        purchase_price: 10000,
        selling_price: 15000,
        stock_quantity: 100,
        min_stock_level: 10,
        unit: 'pcs',
        is_active: true,
      });
      addTestResult(`✅ Product created: ${product.name}`);

      // Test stock update
      ProductService.updateStock(product.id, 5, 'subtract');
      const updatedProduct = ProductService.findById(product.id);
      addTestResult(
        `✅ Stock updated: ${updatedProduct?.stock_quantity} remaining`
      );

      // Test search
      const searchResults = ProductService.search('Test');
      addTestResult(`✅ Search found ${searchResults.length} products`);

      // Test Customers
      addTestResult('👥 Testing Customer operations...');
      const customer = await CustomerService.create({
        name: 'Test Customer',
        email: 'customer@test.com',
        phone: '081234567890',
        address: 'Test Address',
        city: 'Test City',
        customer_type: 'regular',
        credit_limit: 1000000,
        is_active: true,
      });
      addTestResult(`✅ Customer created: ${customer.name}`);

      // Test Suppliers
      addTestResult('🏢 Testing Supplier operations...');
      const supplier = await SupplierService.create({
        name: 'Test Supplier',
        contact_person: 'Test Contact',
        email: 'supplier@test.com',
        phone: '021234567890',
        is_active: true,
      });
      addTestResult(`✅ Supplier created: ${supplier.name}`);

      addTestResult('🎉 All CRUD tests completed successfully!');
    } catch (error) {
      addTestResult(
        `❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const runDataQueries = async () => {
    setTestResults([]);
    addTestResult('📊 Running data queries...');

    try {
      const users = UserService.findAll();
      addTestResult(`👤 Total users: ${users.length}`);

      const categories = CategoryService.findAll();
      addTestResult(`📂 Total categories: ${categories.length}`);

      const products = ProductService.findAll();
      addTestResult(`📦 Total products: ${products.length}`);

      const lowStockProducts = ProductService.findLowStock();
      addTestResult(`⚠️ Low stock products: ${lowStockProducts.length}`);

      const customers = CustomerService.findAll();
      addTestResult(`👥 Total customers: ${customers.length}`);

      const suppliers = SupplierService.findAll();
      addTestResult(`🏢 Total suppliers: ${suppliers.length}`);

      addTestResult('✅ Data queries completed!');
    } catch (error) {
      addTestResult(
        `❌ Query failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Initializing database...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Database Error
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Database Not Ready
        </h3>
        <p className="text-yellow-600">
          Please wait while the database initializes...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Database Testing
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button onClick={runCRUDTests}>Run CRUD Tests</Button>
          <Button onClick={runDataQueries} variant="secondary">
            Run Data Queries
          </Button>
          <Button onClick={clearAndSeed} variant="outline">
            Clear & Reseed Data
          </Button>
        </div>
      </div>

      {testResults.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Test Results:</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono text-gray-700">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
          <div>
            <h3 className="font-semibold text-green-800">
              Database Status: Ready
            </h3>
            <p className="text-sm text-green-600">
              SQLite database initialized with IndexedDB persistence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
