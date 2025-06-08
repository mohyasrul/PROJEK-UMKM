import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Icons } from './Icons';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      resize = 'vertical',
      className,
      ...props
    },
    ref
  ) => {
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              'w-full px-3 py-2 border rounded-lg shadow-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
              resizeClasses[resize],
              error
                ? 'border-red-300 text-red-900 dark:text-red-100 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
              props.disabled &&
                'bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-700',
              className
            )}
            rows={props.rows || 4}
            {...props}
          />
        </div>

        {(error || helperText) && (
          <div className="mt-1">
            {error ? (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <Icons.AlertCircle className="h-4 w-4" />
                {error}
              </p>
            ) : helperText ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
