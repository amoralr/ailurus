import { atom } from 'nanostores';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';

// Load initial theme from localStorage or system preference
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored) return stored;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const themeStore = atom<Theme>(getInitialTheme());

const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const toggleTheme = () => {
  const current = themeStore.get();
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
};

export const setTheme = (theme: Theme) => {
  themeStore.set(theme);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }
};
