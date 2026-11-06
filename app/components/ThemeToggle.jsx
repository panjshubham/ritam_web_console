// Client Component: Manages interactive light/dark theme toggling, defaulting to light mode while allowing user theme selection (Module 05).
'use client';

import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ritam_theme');
      if (stored === 'dark') {
        setTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (e) {
      // Fallback on restricted storage access
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    try {
      localStorage.setItem('ritam_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
    } catch (e) {
      // Ignore write errors
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Current theme: ${theme}. Click to switch to ${theme === 'dark' ? 'light' : 'dark'} mode.`}
      style={{
        backgroundColor: 'var(--surface-2)',
        border: '1px solid var(--line)',
        color: 'var(--ink)',
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--mono)',
        padding: 'var(--space-2) var(--space-3)',
        borderRadius: 'var(--radius-sm)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        minHeight: '40px',
        cursor: 'pointer',
      }}
    >
      <span>Theme:</span>
      <span style={{ textTransform: 'capitalize', color: 'var(--brass)', fontWeight: 600 }}>
        {theme === 'dark' ? 'Dark 🌙' : 'Light ☀'}
      </span>
    </button>
  );
}

