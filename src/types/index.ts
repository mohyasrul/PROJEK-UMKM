// User & Authentication Types
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager' | 'cashier';
  createdAt: Date;
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
  parentId?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  barcode?: string;
  priceBuy: number;
  priceSell: number;
  stockMinimum: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
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
  phone?: string;
  email?: string;
  address?: string;
  creditLimit: number;
  totalPurchases: number;
  createdAt: Date;
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
