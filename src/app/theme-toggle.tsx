"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "ctrl-love-theme";
const THEME_CHANGE_EVENT = "ctrl-love-theme-change";

type Theme = "day" | "night";

declare global {
  interface Window {
    ctrlLoveTheme?: {
      apply: (theme: Theme) => void;
      get: () => Theme;
      set?: (theme: Theme) => void;
      toggle?: () => void;
      storageKey: string;
    };
  }
}

function readSavedTheme(): Theme {
  try {
    return window.ctrlLoveTheme?.get() ?? (localStorage.getItem(STORAGE_KEY) === "night" ? "night" : "day");
  } catch {
    return "day";
  }
}

function currentTheme(): Theme {
  if (typeof window === "undefined") {
    return "day";
  }

  if (document.documentElement.dataset.theme === "night") {
    return "night";
  }

  return readSavedTheme();
}

function commitTheme(theme: Theme) {
  if (window.ctrlLoveTheme?.set) {
    window.ctrlLoveTheme.set(theme);
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {}

  const isNight = theme === "night";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = isNight ? "dark" : "light";
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [theme, setCurrentTheme] = useState<Theme>("day");

  useEffect(() => {
    function syncTheme() {
      setCurrentTheme(currentTheme());
    }

    syncTheme();
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
    window.addEventListener("storage", syncTheme);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) {
      return;
    }

    function toggleTheme(event: Event) {
    event.preventDefault();
    event.stopPropagation();
      if ("stopImmediatePropagation" in event) {
        event.stopImmediatePropagation();
      }

    const nextTheme = currentTheme() === "night" ? "day" : "night";
    commitTheme(nextTheme);
    setCurrentTheme(nextTheme);
  }

    button.addEventListener("click", toggleTheme);

    return () => {
      button.removeEventListener("click", toggleTheme);
    };
  }, []);

  const isNight = theme === "night";

  return (
    <button
      ref={buttonRef}
      className="theme-toggle"
      data-theme-toggle
      type="button"
      aria-label={isNight ? "Switch to day mode" : "Switch to night mode"}
      aria-pressed={isNight}
      suppressHydrationWarning
    >
      {isNight ? "Day mode" : "Night mode"}
    </button>
  );
}
