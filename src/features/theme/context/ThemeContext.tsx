import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark" | "auto";

const STORAGE_KEY = "app-theme";
const DEFAULT_THEME: Theme = "auto";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeToDom(theme: Theme): boolean {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = theme === "dark" || (theme === "auto" && prefersDark);

  root.classList.toggle("theme-dark", shouldBeDark);
  return shouldBeDark;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored ?? DEFAULT_THEME;
  });

  const [isDark, setIsDark] = useState(() =>
    applyThemeToDom((localStorage.getItem(STORAGE_KEY) as Theme | null) ?? DEFAULT_THEME)
  );

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
    setIsDark(applyThemeToDom(next));
  }, []);

  // Sync "auto" mode when OS preference changes at runtime
  useEffect(() => {
    if (theme !== "auto") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const dark = applyThemeToDom("auto");
      setIsDark(dark);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>{children}</ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}
