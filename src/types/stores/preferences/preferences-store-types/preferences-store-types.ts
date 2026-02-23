import type { EditableThemePalette, ThemeMode } from "@/theme/index";

export type PreferencesState = {
  themeMode: ThemeMode;
  lightPalette: EditableThemePalette;
  darkPalette: EditableThemePalette;
};

export type PreferencesActions = {
  setThemeMode: (themeMode: ThemeMode) => void;
  setPaletteColor: (
    mode: "light" | "dark",
    colorKey: keyof EditableThemePalette,
    value: string,
  ) => void;
  resetPalette: (mode: "light" | "dark") => void;
};

export type PreferencesStore = PreferencesState & PreferencesActions;
