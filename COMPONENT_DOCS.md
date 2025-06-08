# UMKM App - Component Library Documentation

## 🎨 UI Component Library

This document provides usage examples and API documentation for all components in the UMKM Management App.

---

## 🔘 Button Component

### Variants

- `default` - Primary blue button
- `secondary` - Gray button
- `outline` - Outlined button
- `ghost` - Transparent button
- `destructive` - Red danger button
- `success` - Green success button
- `warning` - Yellow warning button

### Sizes

- `xs` - Extra small
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large
- `xl` - Extra large

### Usage

```tsx
import Button from '@/components/Button';
import { Icons } from '@/components/Icons';

// Basic button
<Button variant="default">Save</Button>

// Button with icon and loading
<Button
  variant="success"
  size="lg"
  leftIcon={<Icons.add className="h-4 w-4" />}
  loading={isLoading}
  onClick={handleSave}
>
  Add Product
</Button>

// Disabled button
<Button variant="outline" disabled>
  Cannot Click
</Button>
```

---

## 📝 Form Components

### Input Component

```tsx
import Input from '@/components/Input';

<Input
  label="Product Name"
  placeholder="Enter product name..."
  value={productName}
  onChange={(e) => setProductName(e.target.value)}
  required
  error={nameError}
/>;
```

### Select Component

```tsx
import Select from '@/components/Select';

const options = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'food', label: 'Food & Beverage' },
];

<Select
  label="Category"
  options={options}
  value={selectedCategory}
  onChange={setSelectedCategory}
  placeholder="Select category..."
  searchable
/>;
```

### Textarea Component

```tsx
import Textarea from '@/components/Textarea';

<Textarea
  label="Description"
  placeholder="Enter product description..."
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
  resize="vertical"
  maxLength={500}
/>;
```

### Checkbox Component

```tsx
import Checkbox from '@/components/Checkbox';

<Checkbox
  label="Featured Product"
  description="Show this product on homepage"
  checked={isFeatured}
  onChange={(e) => setIsFeatured(e.target.checked)}
/>

// Indeterminate state
<Checkbox
  label="Select All"
  checked={selectedItems.length === totalItems}
  indeterminate={selectedItems.length > 0 && selectedItems.length < totalItems}
  onChange={handleSelectAll}
/>
```

### Radio Group Component

```tsx
import { RadioGroup } from '@/components/Radio';

const statusOptions = [
  {
    value: 'active',
    label: 'Active',
    description: 'Product is available for sale',
  },
  {
    value: 'inactive',
    label: 'Inactive',
    description: 'Product is not available',
  },
  { value: 'draft', label: 'Draft', description: 'Product is being prepared' },
];

<RadioGroup
  name="productStatus"
  label="Product Status"
  options={statusOptions}
  value={status}
  onChange={setStatus}
/>;
```

---

## 🏗️ Layout Components

### Modal Component

```tsx
import Modal from '@/components/Modal';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Add New Product"
  size="lg"
  closeOnBackdrop={true}
>
  <div className="space-y-4">
    <Input label="Product Name" />
    <Select label="Category" options={categories} />

    <div className="flex gap-2 justify-end">
      <Button variant="outline" onClick={() => setIsModalOpen(false)}>
        Cancel
      </Button>
      <Button variant="default">Save Product</Button>
    </div>
  </div>
</Modal>;
```

### Card Component

```tsx
import Card from '@/components/Card';

// Basic card
<Card className="p-6">
  <h3>Product Statistics</h3>
  <p>Total products: 1,234</p>
</Card>

// Card with title
<Card title="Recent Orders" className="p-6">
  <div className="space-y-2">
    {/* Order list */}
  </div>
</Card>
```

### Table Component

```tsx
import Table from '@/components/Table';

const columns = [
  { key: 'id', header: 'ID', sortable: true, title: 'Product ID' },
  { key: 'name', header: 'Name', sortable: true, title: 'Product Name' },
  { key: 'price', header: 'Price', sortable: true, title: 'Price' },
  { key: 'stock', header: 'Stock', sortable: false, title: 'Stock Quantity' },
];

const data = [
  { id: 'PRD001', name: 'Laptop', price: 'Rp 15,000,000', stock: 5 },
  { id: 'PRD002', name: 'Mouse', price: 'Rp 150,000', stock: 20 },
];

<Table
  data={data}
  columns={columns}
  onRowSelect={(rows) => setSelectedRows(rows)}
  selectable
/>;
```

---

## 🔔 Notification System

### Toast Notifications

```tsx
import { toast } from '@/stores/toastStore';

// Success toast
toast.success('Product saved successfully!');

// Error toast with custom options
toast.error('Failed to save product', {
  title: 'Save Error',
  duration: 5000,
});

// Warning toast
toast.warning('Stock is running low');

// Info toast
toast.info('New feature available!', {
  title: 'Update',
  duration: 6000,
});
```

---

## 🎨 Theme System

### Theme Toggle

```tsx
import ThemeToggle from '@/components/ThemeToggle';

// Renders theme switcher button
<ThemeToggle />;
```

### Using Theme Context

```tsx
import { useTheme } from '@/contexts/ThemeContext';

const MyComponent = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
};
```

---

## 🔄 Loading & Error States

### Loading Component

```tsx
import Loading from '@/components/Loading';

// Spinner loading
<Loading />

// Loading with text
<Loading text="Saving product..." />

// Different sizes
<Loading size="sm" />
<Loading size="lg" />
```

### Error Boundary

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>;
```

---

## 🎯 Navigation

### Using Navigation Store

```tsx
import { useNavigationStore } from '@/stores/navigationStore';

const MyComponent = () => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useNavigationStore();

  return (
    <button onClick={toggleSidebar}>
      {isSidebarOpen ? 'Close' : 'Open'} Sidebar
    </button>
  );
};
```

---

## 🎨 Icons

### Available Icons

```tsx
import { Icons } from '@/components/Icons';

// Usage in components
<Icons.add className="h-5 w-5" />
<Icons.edit className="h-4 w-4 text-blue-500" />
<Icons.delete className="h-4 w-4 text-red-500" />

// Available icons:
// add, edit, delete, search, menu, close, home, dashboard,
// products, customers, suppliers, orders, finance, reports,
// settings, user, bell, moon, sun, check, warning, info,
// chevronDown, chevronUp, chevronLeft, chevronRight, minus
```

---

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Responsive Classes

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>

// Hide/show on different screens
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

---

## 🔧 Advanced Usage

### Form Validation Example

```tsx
import { useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { toast } from '@/stores/toastStore';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      setNameError('Product name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // API call here
      toast.success('Product saved successfully!');
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Product Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setNameError(''); // Clear error on change
        }}
        error={nameError}
        required
      />

      <Button type="submit" loading={isSubmitting} disabled={!name.trim()}>
        Save Product
      </Button>
    </form>
  );
};
```

### Modal with Form Example

```tsx
const ProductModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
    toast.success('Product added successfully!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Product" size="lg">
      <div className="space-y-4">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={formData.category}
          onChange={(value) => setFormData({ ...formData, category: value })}
        />

        <Input
          label="Price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Product</Button>
        </div>
      </div>
    </Modal>
  );
};
```

---

## 🎉 Component Library Complete!

This comprehensive UI library provides all the building blocks needed for the UMKM Management App. All components are:

- ✅ **Fully Typed** with TypeScript
- ✅ **Responsive** and mobile-friendly
- ✅ **Accessible** with ARIA support
- ✅ **Themeable** with light/dark modes
- ✅ **Tested** with comprehensive test suite
- ✅ **Documented** with usage examples

**Ready for Day 5: Authentication & User Management!** 🚀
