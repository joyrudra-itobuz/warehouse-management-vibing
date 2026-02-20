import { create } from "zustand";

import type { ThemeMode } from "@/theme";
import type { PreferencesStore } from "@/types/stores/preferences/preferences-store-types/preferences-store-types";

const THEME_MODE_STORAGE_KEY = "wm-theme-mode";
const LIGHT_ACCENT_STORAGE_KEY = "wm-theme-light-accent";
const DARK_ACCENT_STORAGE_KEY = "wm-theme-dark-accent";
const DEFAULT_LIGHT_ACCENT = "#8FAA30";
const DEFAULT_DARK_ACCENT = "#9BBC3D";

function isHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "system";
  }

  const storedValue = localStorage.getItem(THEME_MODE_STORAGE_KEY);

  if (
    storedValue === "light" ||
    storedValue === "dark" ||
    storedValue === "system"
  ) {
    return storedValue;
  }

  return "system";
}

function setStoredThemeMode(value: ThemeMode) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(THEME_MODE_STORAGE_KEY, value);
}

function getStoredAccentColor(storageKey: string, fallback: string) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedValue = localStorage.getItem(storageKey);

  if (storedValue && isHexColor(storedValue)) {
    return storedValue;
  }

  return fallback;
}

function setStoredAccentColor(storageKey: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(storageKey, value);
}

export const usePreferencesStore = create<PreferencesStore>()((set) => ({
  themeMode: getStoredThemeMode(),
  lightAccentColor: getStoredAccentColor(
    LIGHT_ACCENT_STORAGE_KEY,
    DEFAULT_LIGHT_ACCENT,
  ),
  darkAccentColor: getStoredAccentColor(
    DARK_ACCENT_STORAGE_KEY,
    DEFAULT_DARK_ACCENT,
  ),
  setThemeMode: (themeMode) => {
    setStoredThemeMode(themeMode);
    set({ themeMode });
  },
  setLightAccentColor: (color) => {
    if (!isHexColor(color)) {
      return;
    }

    setStoredAccentColor(LIGHT_ACCENT_STORAGE_KEY, color);
    set({ lightAccentColor: color });
  },
  setDarkAccentColor: (color) => {
    if (!isHexColor(color)) {
      return;
    }

    setStoredAccentColor(DARK_ACCENT_STORAGE_KEY, color);
    set({ darkAccentColor: color });
  },
}));
