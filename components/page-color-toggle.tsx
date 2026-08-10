'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'grand-page-theme';
type Theme = 'dark' | 'light';

export function PageColorToggle({ darkLabel, lightLabel }: { darkLabel: string; lightLabel: string }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const nextTheme: Theme = saved === 'light' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  const label = theme === 'dark' ? lightLabel : darkLabel;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className="fixed bottom-5 right-[4.5rem] z-40 inline-flex size-11 items-center justify-center border border-gold/60 bg-ink/90 text-gold shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-gold-bright hover:bg-ink hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-bright sm:bottom-7 sm:right-[6.5rem]"
    >
      {theme === 'dark' ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
      <span className="sr-only">{label}</span>
    </button>
  );
}
