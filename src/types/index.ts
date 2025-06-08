// User & Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'admin' | 'user' | 'cashier';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

// Product & Inventory Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category_id?: string;
  category_name?: string; // From JOIN query
  purchase_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_level: number;
  unit: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductUnit {
  id: string;
  productId: string;
  unitName: string;
  conversionRate: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  locationId: string;
  quantity: number;
  costBasis: number;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  customer_type: 'regular' | 'vip' | 'wholesale';
  credit_limit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Sales Types
export interface SalesOrder {
  id: string;
  customerId?: string;
  total: number;
  tax: number;
  discount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface SalesOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  discount: number;
}

// Payment Types
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'cash' | 'card' | 'qris' | 'transfer';
  reference?: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
