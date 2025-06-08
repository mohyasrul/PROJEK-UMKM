import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { Icons } from './Icons';
import { useToastStore } from '@/stores/toastStore';
import type { Toast, ToastType } from '@/stores/toastStore';
import Button from './Button';

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <Icons.CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <Icons.XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <Icons.AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Icons.Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Icons.Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-white dark:bg-gray-800 border-l-4 border-l-green-500';
      case 'error':
        return 'bg-white dark:bg-gray-800 border-l-4 border-l-red-500';
      case 'warning':
        return 'bg-white dark:bg-gray-800 border-l-4 border-l-yellow-500';
      case 'info':
        return 'bg-white dark:bg-gray-800 border-l-4 border-l-blue-500';
      default:
        return 'bg-white dark:bg-gray-800 border-l-4 border-l-gray-500';
    }
  };

  return (
    <div
      className={cn(
        'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 ease-in-out transform',
        getStyles(toast.type),
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon(toast.type)}</div>

          <div className="ml-3 w-0 flex-1">
            {toast.title && (
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {toast.title}
              </p>
            )}
            <p
              className={cn(
                'text-sm text-gray-500 dark:text-gray-400',
                toast.title && 'mt-1'
              )}
            >
              {toast.message}
            </p>

            {toast.action && (
              <div className="mt-3">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={toast.action.onClick}
                >
                  {toast.action.label}
                </Button>
              </div>
            )}
          </div>

          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md"
              onClick={handleRemove}
            >
              <span className="sr-only">Close</span>
              <Icons.X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toastRoot = document.getElementById('toast-root') || document.body;

  return createPortal(
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>,
    toastRoot
  );
};

export default ToastContainer;
