import { create } from "zustand";

import {
  defaultDarkPalette,
  defaultLightPalette,
  type EditableThemePalette,
  type ThemeMode,
} from "@/theme/index";
import type { PreferencesStore } from "@/types/stores/preferences/preferences-store-types/preferences-store-types";

const THEME_MODE_STORAGE_KEY = "wm-theme-mode";
const LIGHT_PALETTE_STORAGE_KEY = "wm-theme-light-palette";
const DARK_PALETTE_STORAGE_KEY = "wm-theme-dark-palette";

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

function isPalette(value: unknown): value is EditableThemePalette {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.primary === "string" &&
    typeof candidate.bgBase === "string" &&
    typeof candidate.bgContainer === "string" &&
    typeof candidate.text === "string" &&
    typeof candidate.textSecondary === "string" &&
    typeof candidate.border === "string" &&
    typeof candidate.sidebar === "string" &&
    typeof candidate.success === "string" &&
    typeof candidate.warning === "string" &&
    typeof candidate.error === "string" &&
    typeof candidate.info === "string"
  );
}

function normalizePalette(
  rawValue: unknown,
  fallback: EditableThemePalette,
): EditableThemePalette {
  if (!isPalette(rawValue)) {
    return fallback;
  }

  const palette = rawValue as EditableThemePalette;

  const sanitized = Object.entries(palette).reduce<EditableThemePalette>(
    function reducePalette(nextPalette, [key, value]) {
      if (isHexColor(value)) {
        nextPalette[key as keyof EditableThemePalette] = value;
      }

      return nextPalette;
    },
    { ...fallback },
  );

  return sanitized;
}

function getStoredPalette(storageKey: string, fallback: EditableThemePalette) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedValue = localStorage.getItem(storageKey);

  if (!storedValue) {
    return fallback;
  }

  try {
    return normalizePalette(JSON.parse(storedValue), fallback);
  } catch {
    return fallback;
  }
}

function setStoredPalette(storageKey: string, value: EditableThemePalette) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(value));
}

export const usePreferencesStore = create<PreferencesStore>()((set) => ({
  themeMode: getStoredThemeMode(),
  lightPalette: getStoredPalette(
    LIGHT_PALETTE_STORAGE_KEY,
    defaultLightPalette,
  ),
  darkPalette: getStoredPalette(DARK_PALETTE_STORAGE_KEY, defaultDarkPalette),
  setThemeMode: (themeMode) => {
    setStoredThemeMode(themeMode);
    set({ themeMode });
  },
  setPaletteColor: (mode, colorKey, value) => {
    if (!isHexColor(value)) {
      return;
    }

    set(function updatePalette(state) {
      const source = mode === "light" ? state.lightPalette : state.darkPalette;
      const nextPalette = {
        ...source,
        [colorKey]: value,
      } as EditableThemePalette;

      if (mode === "light") {
        setStoredPalette(LIGHT_PALETTE_STORAGE_KEY, nextPalette);

        return { lightPalette: nextPalette };
      }

      setStoredPalette(DARK_PALETTE_STORAGE_KEY, nextPalette);

      return { darkPalette: nextPalette };
    });
  },
  resetPalette: (mode) => {
    if (mode === "light") {
      setStoredPalette(LIGHT_PALETTE_STORAGE_KEY, defaultLightPalette);
      set({ lightPalette: defaultLightPalette });
      return;
    }

    setStoredPalette(DARK_PALETTE_STORAGE_KEY, defaultDarkPalette);
    set({ darkPalette: defaultDarkPalette });
  },
}));
