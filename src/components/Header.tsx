import React from 'react';
import { cn } from '@/utils/cn';
import { Icons } from './Icons';
import { useNavigationStore } from '@/stores/navigationStore';
import { useAuthStore } from '@/stores/authStore';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  title?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Dashboard', className }) => {
  const { toggleSidebar } = useNavigationStore();
  const { user } = useAuthStore();

  return (
    <header
      className={cn(
        'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3',
        className
      )}
    >
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden p-2"
          >
            <Icons.menu className="w-5 h-5" />
          </Button>

          {/* Title */}
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Search button */}
          <Button variant="outline" size="sm" className="p-2">
            <Icons.search className="w-4 h-4" />
          </Button>

          {/* Notifications */}
          <Button variant="outline" size="sm" className="p-2 relative">
            <Icons.bell className="w-4 h-4" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* User menu */}
          {user && (
            <div className="flex items-center space-x-2 pl-3 border-l border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Icons.user className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.full_name || user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
