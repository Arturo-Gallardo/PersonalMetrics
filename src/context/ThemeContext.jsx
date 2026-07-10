import * as React from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "personalmetrics_theme";

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem(STORAGE_KEY) || "light";
  });

  const setTheme = useCallback((next) => {
    setThemeState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.classList.toggle("dark", next === "dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next);
        document.documentElement.classList.toggle("dark", next === "dark");
      }
      return next;
    });
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, isDark: theme === "dark" }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
