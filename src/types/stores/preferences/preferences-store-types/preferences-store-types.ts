import type { ThemeMode } from "@/theme";

export type PreferencesState = {
  themeMode: ThemeMode;
};

export type PreferencesActions = {
  setThemeMode: (themeMode: ThemeMode) => void;
};

export type PreferencesStore = PreferencesState & PreferencesActions;
