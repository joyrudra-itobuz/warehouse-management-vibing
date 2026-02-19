import { create } from "zustand";

import type { ThemeMode } from "@/theme";
import type { PreferencesStore } from "@/types/stores/preferences/preferences-store-types/preferences-store-types";

const THEME_MODE_STORAGE_KEY = "wm-theme-mode";

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

export const usePreferencesStore = create<PreferencesStore>()((set) => ({
  themeMode: getStoredThemeMode(),
  setThemeMode: (themeMode) => {
    setStoredThemeMode(themeMode);
    set({ themeMode });
  },
}));
