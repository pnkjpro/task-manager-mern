import { useState, useEffect } from 'react';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="btn btn-ghost theme-toggle-btn"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      id="theme-toggle"
    >
      {isDark ? <HiOutlineSun /> : <HiOutlineMoon />}
    </button>
  );
};

export default ThemeToggle;
