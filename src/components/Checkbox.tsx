import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Icons } from './Icons';

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      size = 'md',
      indeterminate = false,
      className,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const labelSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return (
      <div className="flex items-start gap-3">
        <div className="flex items-center">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className={cn(
                'border-2 rounded transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'dark:focus:ring-offset-gray-900',
                sizeClasses[size],
                error
                  ? 'border-red-300 text-red-600 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500',
                props.disabled && 'opacity-50 cursor-not-allowed',
                'checked:bg-primary-600 checked:border-primary-600',
                'dark:bg-gray-800 dark:checked:bg-primary-600 dark:checked:border-primary-600',
                className
              )}
              {...props}
            />

            {/* Custom checkmark */}
            {props.checked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {indeterminate ? (
                  <Icons.Minus className="h-3 w-3 text-white" />
                ) : (
                  <Icons.Check className="h-3 w-3 text-white" />
                )}
              </div>
            )}
          </div>
        </div>

        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label
                htmlFor={props.id}
                className={cn(
                  'font-medium text-gray-900 dark:text-gray-100 cursor-pointer',
                  labelSizeClasses[size],
                  props.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}

            {description && (
              <p
                className={cn(
                  'text-gray-500 dark:text-gray-400',
                  size === 'sm' ? 'text-xs' : 'text-sm',
                  label && 'mt-1'
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
              <Icons.AlertCircle className="h-4 w-4" />
              {error}
            </p>
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
