import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Icons } from './Icons';
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  placeholder = 'Select an option...',
  disabled = false,
  error,
  label,
  required = false,
  className,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    options.find((opt) => opt.value === value) || null
  );
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedOption(options.find((opt) => opt.value === value) || null);
  }, [value, options]);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    setSelectedOption(option);
    setIsOpen(false);
    onChange?.(option.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div ref={selectRef} className="relative">
        <button
          type="button"
          className={cn(
            'w-full px-3 py-2 text-left bg-white dark:bg-gray-800 border rounded-lg shadow-sm transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            disabled
              ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-700'
              : error
                ? 'border-red-300 text-red-900 dark:text-red-100 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500'
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <Icons.chevronDown
              className={cn(
                'h-4 w-4 text-gray-400 transition-transform',
                isOpen && 'transform rotate-180'
              )}
            />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                    option.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-900 dark:text-gray-100',
                    selectedOption?.value === option.value &&
                      'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  )}
                  onClick={() => handleSelect(option)}
                  disabled={option.disabled}
                >
                  <span className="block truncate">{option.label}</span>
                  {selectedOption?.value === option.value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Icons.Check className="h-4 w-4 text-primary-600" />
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <Icons.AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
