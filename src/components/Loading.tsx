import React from 'react';
import { cn } from '@/utils/cn';
import { Icons } from './Icons';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  className,
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const LoadingContent = (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Icons.loading
        className={cn('animate-spin text-blue-600', sizeClasses[size])}
      />
      {text && (
        <p
          className={cn(
            'mt-2 text-gray-600 dark:text-gray-400',
            textSizeClasses[size]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75">
        {LoadingContent}
      </div>
    );
  }

  return LoadingContent;
};

export default Loading;
