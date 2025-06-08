import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Icons } from './Icons';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  componentSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  label,
  error,
  required = false,
  orientation = 'vertical',
  componentSize = 'md',
  className,
}) => {
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
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={cn(
          'space-y-3',
          orientation === 'horizontal' && 'flex flex-wrap gap-6 space-y-0'
        )}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start gap-3">
            <div className="flex items-center">
              <input
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={option.disabled}
                className={cn(
                  'border-2 rounded-full transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  'dark:focus:ring-offset-gray-900',
                  sizeClasses[componentSize],
                  error
                    ? 'border-red-300 text-red-600 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500',
                  option.disabled && 'opacity-50 cursor-not-allowed',
                  'checked:bg-primary-600 checked:border-primary-600',
                  'dark:bg-gray-800 dark:checked:bg-primary-600 dark:checked:border-primary-600'
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              {' '}
              <label
                htmlFor={`${name}-${option.value}`}
                className={cn(
                  'font-medium text-gray-900 dark:text-gray-100 cursor-pointer',
                  labelSizeClasses[componentSize],
                  option.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {option.label}
              </label>{' '}
              {option.description && (
                <p
                  className={cn(
                    'text-gray-500 dark:text-gray-400 mt-1',
                    componentSize === 'sm' ? 'text-xs' : 'text-sm'
                  )}
                >
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <Icons.AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// Single Radio component for individual use
interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  error?: string;
  componentSize?: 'sm' | 'md' | 'lg';
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    { label, description, error, componentSize = 'md', className, ...props },
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
          <input
            ref={ref}
            type="radio"
            className={cn(
              'border-2 rounded-full transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'dark:focus:ring-offset-gray-900',
              sizeClasses[componentSize],
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
        </div>

        {(label || description) && (
          <div className="flex-1 min-w-0">
            {' '}
            {label && (
              <label
                htmlFor={props.id}
                className={cn(
                  'font-medium text-gray-900 dark:text-gray-100 cursor-pointer',
                  labelSizeClasses[componentSize],
                  props.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}{' '}
            {description && (
              <p
                className={cn(
                  'text-gray-500 dark:text-gray-400',
                  componentSize === 'sm' ? 'text-xs' : 'text-sm',
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

Radio.displayName = 'Radio';

export { RadioGroup, Radio };
export default RadioGroup;
