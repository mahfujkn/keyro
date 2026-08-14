import { useEffect } from 'react';
import { Theme } from '../types';

export function useTheme(theme: Theme) {
  useEffect(() => {
    const applyTheme = (isDark: boolean) => {
      try {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } catch (e) {
        console.warn('Failed to set data-theme attribute', e);
      }
    };

    if (theme === 'system') {
      try {
        if (typeof window !== 'undefined' && window.matchMedia) {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          applyTheme(mediaQuery.matches);

          const listener = (e: MediaQueryListEvent | MediaQueryList) => applyTheme(e.matches);

          if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', listener as any);
            return () => mediaQuery.removeEventListener('change', listener as any);
          } else if ((mediaQuery as any).addListener) {
            (mediaQuery as any).addListener(listener);
            return () => (mediaQuery as any).removeListener(listener);
          }
        } else {
          applyTheme(true); // default dark fallback
        }
      } catch (e) {
        console.warn('System theme listener error', e);
        applyTheme(true);
      }
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);
}
