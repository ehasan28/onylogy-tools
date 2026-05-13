export type Theme = "light" | "dark" | "system";
export const THEME_STORAGE_KEY = "tg-theme";

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

export function applyThemeClass(theme: Theme): void {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(theme);
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/** Inline script run before paint to prevent FOUC. */
export const themeBootstrapScript = `
try {
  var t = localStorage.getItem('${THEME_STORAGE_KEY}') || 'system';
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var resolved = t === 'system' ? (prefersDark ? 'dark' : 'light') : t;
  if (resolved === 'dark') {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`.trim();
