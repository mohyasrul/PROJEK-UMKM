import {
  UserService,
  CategoryService,
  ProductService,
  CustomerService,
  SupplierService,
} from './services';

export class DataSeeder {
  static async seedAll(): Promise<void> {
    console.log('🌱 Starting data seeding...');

    try {
      await this.seedUsers();
      await this.seedCategories();
      await this.seedSuppliers();
      await this.seedProducts();
      await this.seedCustomers();

      console.log('✅ Data seeding completed successfully!');
    } catch (error) {
      console.error('❌ Data seeding failed:', error);
      throw error;
    }
  }
  static async seedUsers(): Promise<void> {
    console.log('👤 Seeding users...');

    // Create default admin user
    const adminExists = UserService.findByUsername('admin');
    if (!adminExists) {
      // Use actual password hashing for seeded users
      const { hashPassword } = await import('@/utils/auth');

      await UserService.create({
        username: 'admin',
        email: 'admin@umkm.local',
        password_hash: hashPassword('admin123'), // Default password: admin123
        full_name: 'Administrator',
        role: 'admin',
        is_active: true,
      });
    }

    // Create cashier user
    const cashierExists = UserService.findByUsername('cashier');
    if (!cashierExists) {
      const { hashPassword } = await import('@/utils/auth');

      await UserService.create({
        username: 'cashier',
        email: 'cashier@umkm.local',
        password_hash: hashPassword('cashier123'), // Default password: cashier123
        full_name: 'Kasir Utama',
        role: 'cashier',
        is_active: true,
      });
    }

    console.log('✅ Users seeded');
  }

  static async seedCategories(): Promise<void> {
    console.log('📂 Seeding categories...');
    const categories = [
      {
        name: 'Makanan & Minuman',
        description: 'Produk makanan dan minuman',
        is_active: true,
      },
      {
        name: 'Elektronik',
        description: 'Perangkat elektronik',
        is_active: true,
      },
      {
        name: 'Pakaian',
        description: 'Pakaian dan aksesoris',
        is_active: true,
      },
      {
        name: 'Kesehatan & Kecantikan',
        description: 'Produk kesehatan dan kecantikan',
        is_active: true,
      },
      {
        name: 'Rumah Tangga',
        description: 'Peralatan rumah tangga',
        is_active: true,
      },
    ];

    const subCategories = [
      {
        name: 'Minuman Ringan',
        description: 'Minuman ringan dan soda',
        parent: 'Makanan & Minuman',
      },
      {
        name: 'Snack',
        description: 'Makanan ringan',
        parent: 'Makanan & Minuman',
      },
      {
        name: 'Handphone',
        description: 'Ponsel dan aksesoris',
        parent: 'Elektronik',
      },
      {
        name: 'Komputer',
        description: 'Laptop dan komputer',
        parent: 'Elektronik',
      },
      {
        name: 'Baju Pria',
        description: 'Pakaian untuk pria',
        parent: 'Pakaian',
      },
      {
        name: 'Baju Wanita',
        description: 'Pakaian untuk wanita',
        parent: 'Pakaian',
      },
    ];

    // Create main categories
    const categoryMap: { [key: string]: string } = {};
    for (const category of categories) {
      const existing = CategoryService.findAll().find(
        (c) => c.name === category.name
      );
      if (!existing) {
        const created = await CategoryService.create(category);
        categoryMap[category.name] = created.id;
      } else {
        categoryMap[category.name] = existing.id;
      }
    }

    // Create sub categories
    for (const subCategory of subCategories) {
      const existing = CategoryService.findAll().find(
        (c) => c.name === subCategory.name
      );
      if (!existing) {
        await CategoryService.create({
          name: subCategory.name,
          description: subCategory.description,
          parent_id: categoryMap[subCategory.parent],
          is_active: true,
        });
      }
    }

    console.log('✅ Categories seeded');
  }

  static async seedSuppliers(): Promise<void> {
    console.log('🏢 Seeding suppliers...');

    const suppliers = [
      {
        name: 'PT Sumber Rejeki',
        contact_person: 'Budi Santoso',
        email: 'budi@sumberrejeki.com',
        phone: '021-1234567',
        address: 'Jl. Raya No. 123',
        city: 'Jakarta',
        postal_code: '12345',
      },
      {
        name: 'CV Maju Bersama',
        contact_person: 'Siti Rahayu',
        email: 'siti@majubersama.com',
        phone: '022-2345678',
        address: 'Jl. Sudirman No. 456',
        city: 'Bandung',
        postal_code: '23456',
      },
      {
        name: 'Toko Elektronik Jaya',
        contact_person: 'Ahmad Wijaya',
        email: 'ahmad@elektronikjaya.com',
        phone: '031-3456789',
        address: 'Jl. Pemuda No. 789',
        city: 'Surabaya',
        postal_code: '34567',
      },
    ];

    for (const supplier of suppliers) {
      const existing = SupplierService.findAll().find(
        (s) => s.name === supplier.name
      );
      if (!existing) {
        await SupplierService.create({
          ...supplier,
          is_active: true,
        });
      }
    }

    console.log('✅ Suppliers seeded');
  }

  static async seedProducts(): Promise<void> {
    console.log('📦 Seeding products...');

    // Get categories for reference
    const categories = CategoryService.findAll();
    const snackCategory = categories.find((c) => c.name === 'Snack');
    const minumanCategory = categories.find((c) => c.name === 'Minuman Ringan');
    const handphoneCategory = categories.find((c) => c.name === 'Handphone');

    const products = [
      {
        name: 'Chitato Original',
        description: 'Keripik kentang rasa original',
        sku: 'CHT-001',
        barcode: '8996001234567',
        category_id: snackCategory?.id,
        purchase_price: 8000,
        selling_price: 12000,
        stock_quantity: 50,
        min_stock_level: 10,
        unit: 'pcs',
      },
      {
        name: 'Coca Cola 330ml',
        description: 'Minuman berkarbonasi Coca Cola kaleng 330ml',
        sku: 'CC-330',
        barcode: '8992761234567',
        category_id: minumanCategory?.id,
        purchase_price: 4000,
        selling_price: 6000,
        stock_quantity: 100,
        min_stock_level: 20,
        unit: 'kaleng',
      },
      {
        name: 'Sprite 330ml',
        description: 'Minuman berkarbonasi Sprite kaleng 330ml',
        sku: 'SPR-330',
        barcode: '8992762234567',
        category_id: minumanCategory?.id,
        purchase_price: 4000,
        selling_price: 6000,
        stock_quantity: 80,
        min_stock_level: 15,
        unit: 'kaleng',
      },
      {
        name: 'Samsung Galaxy A24',
        description: 'Smartphone Samsung Galaxy A24 8GB/128GB',
        sku: 'SAM-A24-8128',
        barcode: '8806094234567',
        category_id: handphoneCategory?.id,
        purchase_price: 2800000,
        selling_price: 3200000,
        stock_quantity: 5,
        min_stock_level: 2,
        unit: 'unit',
      },
      {
        name: 'iPhone 15',
        description: 'Apple iPhone 15 128GB',
        sku: 'APL-IP15-128',
        barcode: '1943012345678',
        category_id: handphoneCategory?.id,
        purchase_price: 12000000,
        selling_price: 14000000,
        stock_quantity: 2,
        min_stock_level: 1,
        unit: 'unit',
      },
    ];

    for (const product of products) {
      const existing = ProductService.findBySku(product.sku || '');
      if (!existing) {
        await ProductService.create({
          ...product,
          is_active: true,
        });
      }
    }

    console.log('✅ Products seeded');
  }

  static async seedCustomers(): Promise<void> {
    console.log('👥 Seeding customers...');

    const customers = [
      {
        name: 'Budi Pratama',
        email: 'budi.pratama@email.com',
        phone: '081234567890',
        address: 'Jl. Merdeka No. 100',
        city: 'Jakarta',
        postal_code: '10110',
        customer_type: 'regular' as const,
        credit_limit: 1000000,
      },
      {
        name: 'Sari Dewi',
        email: 'sari.dewi@email.com',
        phone: '082345678901',
        address: 'Jl. Sudirman No. 200',
        city: 'Bandung',
        postal_code: '20220',
        customer_type: 'vip' as const,
        credit_limit: 5000000,
      },
      {
        name: 'Toko Berkah Jaya',
        phone: '083456789012',
        address: 'Jl. Raya Bogor No. 300',
        city: 'Bogor',
        postal_code: '30330',
        customer_type: 'wholesale' as const,
        credit_limit: 10000000,
      },
      {
        name: 'Ibu Ratna',
        phone: '084567890123',
        address: 'Jl. Kebon Jeruk No. 50',
        city: 'Jakarta',
        postal_code: '11530',
        customer_type: 'regular' as const,
        credit_limit: 500000,
      },
    ];

    for (const customer of customers) {
      const existing = customer.phone
        ? CustomerService.findByPhone(customer.phone)
        : null;
      if (!existing) {
        await CustomerService.create({
          ...customer,
          is_active: true,
        });
      }
    }

    console.log('✅ Customers seeded');
  }

  static async clearAllData(): Promise<void> {
    console.log('🗑️ Clearing all seeded data...');

    // Clear in reverse order due to foreign key constraints
    const products = ProductService.findAll();
    for (const product of products) {
      ProductService.delete(product.id);
    }

    const customers = CustomerService.findAll();
    for (const customer of customers) {
      CustomerService.delete(customer.id);
    }

    const suppliers = SupplierService.findAll();
    for (const supplier of suppliers) {
      SupplierService.delete(supplier.id);
    }

    const categories = CategoryService.findAll();
    for (const category of categories) {
      try {
        CategoryService.delete(category.id);
      } catch (error) {
        // Skip if has dependencies
      }
    }

    const users = UserService.findAll();
    for (const user of users) {
      UserService.delete(user.id);
    }

    console.log('✅ All data cleared');
  }
}
