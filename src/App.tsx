import React from 'react';
import Button from '@/components/Button';
import { useAuthStore } from '@/stores/authStore';

const App: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useAuthStore();

  const handleLogin = () => {
    // Demo login
    login(
      {
        id: 'demo-user',
        username: 'demo',
        role: 'admin',
        createdAt: new Date(),
      },
      'demo-token'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            UMKM Management App
          </h1>
          <p className="text-gray-600 mb-8">
            Comprehensive business management solution
          </p>

          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-green-800">
                  Welcome, <strong>{user?.username}</strong>!
                </p>
                <p className="text-sm text-green-600">Role: {user?.role}</p>
              </div>
              <Button onClick={logout} variant="secondary">
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">Please login to continue</p>
              </div>
              <Button onClick={handleLogin}>Demo Login</Button>
            </div>
          )}

          <div className="mt-8 text-sm text-gray-500">
            <p>✅ Vite + React + TypeScript</p>
            <p>✅ Tailwind CSS + Shadcn/ui</p>
            <p>✅ Zustand State Management</p>
            <p>✅ PWA Ready</p>
            <p>✅ ESLint + Prettier</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
