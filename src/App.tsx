import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import AuthPage from '@/pages/AuthPage';
import UserProfile from '@/components/UserProfile';
import { DatabaseTest } from '@/components/DatabaseTest';
import Button from '@/components/Button';
import Card from '@/components/Card';

const App: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Main app interface for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                UMKM Management App
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, <strong>{user?.full_name}</strong>
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {user?.role}
              </span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Welcome Card */}
          <Card
            title="Dashboard"
            subtitle="Welcome to your UMKM management system"
          >
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900">
                  Authentication System
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  ✅ Login/Register forms with validation
                </p>
                <p className="text-sm text-blue-700">
                  ✅ Password hashing and security
                </p>
                <p className="text-sm text-blue-700">✅ Session management</p>
                <p className="text-sm text-blue-700">
                  ✅ User profile management
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-sm text-green-700">Users</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <div className="text-sm text-purple-700">Roles</div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  <strong>Default Credentials:</strong>
                </p>
                <p>Admin: admin / admin123</p>
                <p>Cashier: cashier / cashier123</p>
              </div>
            </div>
          </Card>

          {/* User Profile */}
          <div>
            <UserProfile />
          </div>
        </div>

        {/* Database Test Section */}
        <div className="mt-8">
          <DatabaseTest />
        </div>
      </main>
    </div>
  );
};

export default App;
