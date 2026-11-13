"use client";

import * as React from "react";

/**
 * Accessibility + appearance preferences, applied to <html> attributes so
 * plain CSS (and reduced-motion media queries) can react without re-render.
 * Everything is mirrored to localStorage so the first paint can restore it
 * from the inline bootstrap script in layout.tsx.
 */
export interface Preferences {
  theme: "light" | "dark" | "system";
  reducedMotion: boolean;
  dyslexiaFont: boolean;
  highContrast: boolean;
  fontScale: 100 | 115 | 130;
  readingTheme: "light" | "sepia" | "dark";
  noteFontSize: number;
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: "system",
  reducedMotion: false,
  dyslexiaFont: false,
  highContrast: false,
  fontScale: 100,
  readingTheme: "light",
  noteFontSize: 17,
};

const STORAGE_KEY = "sherpa_preferences";
const PreferencesContext = React.createContext<{
  prefs: Preferences;
  setPrefs: (patch: Partial<Preferences>) => void;
}>({ prefs: DEFAULT_PREFERENCES, setPrefs: () => {} });

export function applyPreferences(prefs: Preferences): void {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = prefs.theme === "dark" || (prefs.theme === "system" && systemDark);
  root.classList.toggle("dark", dark);
  root.dataset.theme = dark ? "dark" : "light";
  root.dataset.reducedMotion = String(prefs.reducedMotion);
  root.dataset.dyslexia = String(prefs.dyslexiaFont);
  root.dataset.contrast = prefs.highContrast ? "high" : "normal";
  root.dataset.fontScale = String(prefs.fontScale);
  root.dataset.reading = prefs.readingTheme;
  root.style.setProperty("--note-font-size", `${prefs.noteFontSize}px`);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefsState] = React.useState<Preferences>(DEFAULT_PREFERENCES);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = { ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as Partial<Preferences>) };
        setPrefsState(parsed);
        applyPreferences(parsed);
      } else {
        applyPreferences(DEFAULT_PREFERENCES);
      }
    } catch {
      applyPreferences(DEFAULT_PREFERENCES);
    }
  }, []);

  const setPrefs = React.useCallback((patch: Partial<Preferences>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...patch };
      applyPreferences(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage may be unavailable in private mode */
      }
      return next;
    });
  }, []);

  return (
    <PreferencesContext.Provider value={{ prefs, setPrefs }}>{children}</PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return React.useContext(PreferencesContext);
}
