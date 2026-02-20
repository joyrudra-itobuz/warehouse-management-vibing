import type { ThemeMode } from "@/theme";

export type PreferencesState = {
  themeMode: ThemeMode;
  lightAccentColor: string;
  darkAccentColor: string;
};

export type PreferencesActions = {
  setThemeMode: (themeMode: ThemeMode) => void;
  setLightAccentColor: (color: string) => void;
  setDarkAccentColor: (color: string) => void;
};

export type PreferencesStore = PreferencesState & PreferencesActions;
