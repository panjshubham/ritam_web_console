// Client Component: Manages interactive light/dark theme toggling, respecting both OS preferences and explicit user overrides (Module 05).
'use client';

import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState('auto'); // 'auto', 'light', 'dark'

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ritam_theme');
      if (stored === 'light' || stored === 'dark') {
        setTheme(stored);
        document.documentElement.setAttribute('data-theme', stored);
      }
    } catch (e) {
      // Fallback on restricted storage access
    }
  }, []);

  const toggleTheme = () => {
    let nextTheme = 'light';
    if (theme === 'light') nextTheme = 'dark';
    else if (theme === 'dark') nextTheme = 'auto';
    else nextTheme = 'dark'; // if auto, toggle to dark first or toggle light

    setTheme(nextTheme);

    try {
      if (nextTheme === 'auto') {
        localStorage.removeItem('ritam_theme');
        document.documentElement.removeAttribute('data-theme');
      } else {
        localStorage.setItem('ritam_theme', nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
      }
    } catch (e) {
      // Ignore write errors
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Current theme: ${theme}. Click to switch theme.`}
      style={{
        backgroundColor: 'var(--surface-2)',
        border: '1px solid var(--line)',
        color: 'var(--ink)',
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--mono)',
        padding: 'var(--space-1) var(--space-2)',
        borderRadius: 'var(--radius-sm)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
      }}
    >
      <span>Theme:</span>
      <span style={{ textTransform: 'capitalize', color: 'var(--brass)' }}>{theme}</span>
    </button>
  );
}
