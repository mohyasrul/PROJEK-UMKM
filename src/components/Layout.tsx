import React, { useEffect } from 'react';
import { cn } from '@/utils/cn';
import { useNavigationStore } from '@/stores/navigationStore';
import Sidebar from './Sidebar';
import Header from './Header';
import ErrorBoundary from './ErrorBoundary';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, className }) => {
  const { setIsMobile, closeSidebar } = useNavigationStore();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(isMobile);

      // Close sidebar on mobile when window is resized to desktop
      if (!isMobile) {
        closeSidebar();
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile, closeSidebar]);

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
          {/* Header */}
          <Header title={title} />

          {/* Main content */}
          <main className={cn('flex-1 overflow-auto p-6', className)}>
            {children}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Layout;
