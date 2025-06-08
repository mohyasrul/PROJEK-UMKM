import React, { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Checkbox from '@/components/Checkbox';
import { RadioGroup } from '@/components/Radio';
import { Icons } from '@/components/Icons';
import { toast } from '@/stores/toastStore';

interface DashboardStats {
  title: string;
  value: string | number;
  change: string;
  icon: keyof typeof Icons;
  color: string;
}

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState('');

  const stats: DashboardStats[] = [
    {
      title: 'Total Sales',
      value: 'Rp 12,500,000',
      change: '+12%',
      icon: 'finance',
      color: 'text-green-600',
    },
    {
      title: 'Products',
      value: 1234,
      change: '+5%',
      icon: 'products',
      color: 'text-blue-600',
    },
    {
      title: 'Customers',
      value: 856,
      change: '+8%',
      icon: 'customers',
      color: 'text-purple-600',
    },
    {
      title: 'Revenue',
      value: 'Rp 8,200,000',
      change: '+15%',
      icon: 'reports',
      color: 'text-yellow-600',
    },
  ];

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const radioOptions = [
    { value: 'small', label: 'Small', description: 'For small businesses' },
    { value: 'medium', label: 'Medium', description: 'For medium enterprises' },
    { value: 'large', label: 'Large', description: 'For large corporations' },
  ];

  // Sample data for recent transactions table
  const recentTransactions = [
    {
      id: 'TXN001',
      customer: 'John Doe',
      amount: 'Rp 150,000',
      status: 'Completed',
      date: '2024-01-15',
    },
    {
      id: 'TXN002',
      customer: 'Jane Smith',
      amount: 'Rp 250,000',
      status: 'Pending',
      date: '2024-01-14',
    },
    {
      id: 'TXN003',
      customer: 'Bob Johnson',
      amount: 'Rp 180,000',
      status: 'Completed',
      date: '2024-01-13',
    },
  ];

  const tableColumns = [
    {
      key: 'id',
      header: 'Transaction ID',
      sortable: true,
      title: 'Transaction ID',
    },
    { key: 'customer', header: 'Customer', sortable: true, title: 'Customer' },
    { key: 'amount', header: 'Amount', sortable: true, title: 'Amount' },
    { key: 'status', header: 'Status', sortable: false, title: 'Status' },
    { key: 'date', header: 'Date', sortable: true, title: 'Date' },
  ];

  const showToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: 'Operation completed successfully!',
      error: 'Something went wrong. Please try again.',
      warning: 'This is a warning message.',
      info: 'Here is some useful information.',
    };

    toast[type](messages[type], {
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`,
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to your UMKM management system with enhanced UI components
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = Icons[stat.icon];
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {stat.value}
                  </p>
                  <p className={`text-sm font-medium mt-1 ${stat.color}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Component Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Components */}
        <Card title="Component Showcase" className="p-6">
          <div className="space-y-6">
            {/* Button Variants */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Button Components
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="default"
                  leftIcon={<Icons.add className="h-4 w-4" />}
                  onClick={() => showToast('success')}
                >
                  Success Toast
                </Button>
                <Button
                  variant="destructive"
                  leftIcon={<Icons.close className="h-4 w-4" />}
                  onClick={() => showToast('error')}
                >
                  Error Toast
                </Button>
                <Button
                  variant="warning"
                  leftIcon={<Icons.warning className="h-4 w-4" />}
                  onClick={() => showToast('warning')}
                >
                  Warning Toast
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<Icons.info className="h-4 w-4" />}
                  onClick={() => showToast('info')}
                >
                  Info Toast
                </Button>
              </div>
            </div>

            {/* Modal Demo */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Modal Component
              </h3>
              <Button
                variant="outline"
                leftIcon={<Icons.settings className="h-4 w-4" />}
                onClick={() => setIsModalOpen(true)}
              >
                Open Demo Modal
              </Button>
            </div>

            {/* Form Components */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Form Components
              </h3>
              <div className="space-y-4">
                <Input
                  label="Sample Input"
                  placeholder="Type something..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />

                <Select
                  label="Sample Select"
                  options={selectOptions}
                  value={selectedOption}
                  onChange={setSelectedOption}
                  placeholder="Choose an option..."
                />

                <Textarea
                  label="Sample Textarea"
                  placeholder="Write your message..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  rows={3}
                />

                <Checkbox
                  label="Sample Checkbox"
                  description="Check this box to agree with terms"
                  checked={checkboxValue}
                  onChange={(e) => setCheckboxValue(e.target.checked)}
                />

                <RadioGroup
                  name="businessSize"
                  label="Business Size"
                  options={radioOptions}
                  value={radioValue}
                  onChange={setRadioValue}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card title="Recent Transactions" className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest customer transactions
              </p>
              <Button size="sm" variant="outline">
                View All
              </Button>
            </div>

            <Table
              data={recentTransactions}
              columns={tableColumns}
              className="w-full"
            />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="default"
            size="lg"
            leftIcon={<Icons.add className="h-5 w-5" />}
            className="justify-start"
          >
            Add New Product
          </Button>
          <Button
            variant="secondary"
            size="lg"
            leftIcon={<Icons.customers className="h-5 w-5" />}
            className="justify-start"
          >
            Manage Customers
          </Button>
          <Button
            variant="outline"
            size="lg"
            leftIcon={<Icons.reports className="h-5 w-5" />}
            className="justify-start"
          >
            View Reports
          </Button>
        </div>
      </Card>

      {/* Demo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Component Demo Modal"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This is a demonstration of the Modal component with various form
            elements inside.
          </p>

          <div className="space-y-4">
            <Input label="Modal Input" placeholder="Enter some text..." />

            <Select
              label="Modal Select"
              options={selectOptions}
              placeholder="Select an option..."
            />

            <div className="flex gap-4">
              <Button variant="default">Save Changes</Button>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
