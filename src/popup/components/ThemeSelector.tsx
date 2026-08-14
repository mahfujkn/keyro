import React from 'react';
import { Theme } from '../../types';

interface ThemeSelectorProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, onChange }) => {
  const getIndex = () => {
    if (theme === 'dark') return 0;
    if (theme === 'light') return 1;
    return 2;
  };

  const indicatorStyle = {
    width: '33.333%',
    transform: `translateX(${getIndex() * 100}%)`,
  };

  return (
    <div className="k-theme-selector" role="radiogroup" aria-label="Theme selection">
      <div className="k-theme-selector__indicator" style={indicatorStyle} />
      <button
        className={`k-theme-selector__option ${theme === 'dark' ? 'k-theme-selector__option--active' : ''}`}
        onClick={() => onChange('dark')}
        role="radio"
        aria-checked={theme === 'dark'}
      >
        Dark
      </button>
      <button
        className={`k-theme-selector__option ${theme === 'light' ? 'k-theme-selector__option--active' : ''}`}
        onClick={() => onChange('light')}
        role="radio"
        aria-checked={theme === 'light'}
      >
        Light
      </button>
      <button
        className={`k-theme-selector__option ${theme === 'system' ? 'k-theme-selector__option--active' : ''}`}
        onClick={() => onChange('system')}
        role="radio"
        aria-checked={theme === 'system'}
      >
        System
      </button>
    </div>
  );
};
