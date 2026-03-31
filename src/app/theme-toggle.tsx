"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "diya-theme";

type Theme = "light" | "dark";

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      applyTheme(stored);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme: Theme = prefersDark ? "dark" : "light";
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_KEY, nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={theme === "light" ? "Switch to Dark" : "Switch to Light"}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === "light" ? (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 15.4A8.5 8.5 0 1 1 8.6 4a7 7 0 1 0 11.4 11.4Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 2.5V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 19V21.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M2.5 12H5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M19 12H21.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M5.3 5.3L7.1 7.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M16.9 16.9L18.7 18.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M16.9 7.1L18.7 5.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M5.3 18.7L7.1 16.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <span>{theme === "light" ? "Dark Mood" : "Light Mood"}</span>
    </button>
  );
}
