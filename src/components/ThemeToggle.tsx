import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Icons } from './Icons';
import Button from './Button';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return <Icons.monitor className="w-4 h-4" />;
    }
    return actualTheme === 'light' ? (
      <Icons.sun className="w-4 h-4" />
    ) : (
      <Icons.moon className="w-4 h-4" />
    );
  };

  const getTooltip = () => {
    if (theme === 'system') return 'System theme';
    return theme === 'light' ? 'Light theme' : 'Dark theme';
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-0"
      title={getTooltip()}
    >
      {getIcon()}
    </Button>
  );
};

export default ThemeToggle;
