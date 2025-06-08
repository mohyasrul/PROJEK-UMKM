import React from 'react';
import { cn } from '@/utils/cn';
import { Icons } from './Icons';
import type { IconName } from './Icons';
import { useNavigationStore } from '@/stores/navigationStore';
import { useAuthStore } from '@/stores/authStore';
import Button from './Button';

interface MenuItem {
  id: string;
  label: string;
  icon: IconName;
  path: string;
  badge?: string | number;
  roles?: string[];
}

interface SidebarProps {
  className?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'home',
    path: '/',
  },
  {
    id: 'products',
    label: 'Products',
    icon: 'products',
    path: '/products',
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'customers',
    path: '/customers',
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: 'sales',
    path: '/sales',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'reports',
    path: '/reports',
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: 'finance',
    path: '/finance',
    roles: ['admin'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: '/settings',
    roles: ['admin'],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { isSidebarOpen, closeSidebar, isMobile } = useNavigationStore();
  const { user, logout } = useAuthStore();

  // For now, we'll just track active path with a simple state
  const [activePath, setActivePath] = React.useState('/');

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  const handleMenuClick = (path: string) => {
    setActivePath(path);
    if (isMobile) {
      closeSidebar();
    }
    // TODO: Navigate to path when router is implemented
    console.log('Navigate to:', path);
  };

  const handleLogout = () => {
    logout();
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:inset-0',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              UMKM App
            </h1>
            {isMobile && (
              <Button
                variant="outline"
                size="sm"
                onClick={closeSidebar}
                className="p-2"
              >
                <Icons.close className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* User info */}
          {user && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Icons.user className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.full_name || user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const Icon = Icons[item.icon];
              const isActive = activePath === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.path)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <Icons.logout className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
