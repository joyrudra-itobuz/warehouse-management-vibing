import type { ThemeConfig } from "antd";
import { theme as antTheme } from "antd";

export type ThemeMode = "light" | "dark" | "system";

export type EditableThemePalette = {
  primary: string;
  bgBase: string;
  bgContainer: string;
  text: string;
  textSecondary: string;
  border: string;
  sidebar: string;
  success: string;
  warning: string;
  error: string;
  info: string;
};

export const defaultLightPalette: EditableThemePalette = {
  primary: "#8FAA30",
  bgBase: "#F2F2F2",
  bgContainer: "#FFFFFF",
  text: "#111111",
  textSecondary: "#555555",
  border: "#E2E2E2",
  sidebar: "#111111",
  success: "#2FB56E",
  warning: "#F3BD45",
  error: "#EE7070",
  info: "#5A98F5",
};

export const defaultDarkPalette: EditableThemePalette = {
  primary: "#9BBC3D",
  bgBase: "#090909",
  bgContainer: "#151515",
  text: "#F4F4F4",
  textSecondary: "#B7B7B7",
  border: "#2A2A2A",
  sidebar: "#191919",
  success: "#2FB56E",
  warning: "#F3BD45",
  error: "#EE7070",
  info: "#5A98F5",
};

export const dashboardLayout = {
  siderWidth: 232,
  siderCollapsedWidth: 88,
  headerHeight: 80,
  contentPadding: 24,
  gridGap: 16,
  cardRadius: 18,
};

function clamp(value: number) {
  return Math.min(255, Math.max(0, value));
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue]
    .map(function toHex(channel) {
      return clamp(channel).toString(16).padStart(2, "0");
    })
    .join("")}`;
}

function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function mixWithWhite(hex: string, ratio: number) {
  const { r, g, b } = hexToRgb(hex);

  return rgbToHex(
    r + (255 - r) * ratio,
    g + (255 - g) * ratio,
    b + (255 - b) * ratio,
  );
}

function mixWithBlack(hex: string, ratio: number) {
  const { r, g, b } = hexToRgb(hex);

  return rgbToHex(r * (1 - ratio), g * (1 - ratio), b * (1 - ratio));
}

function createSharedTheme(palette: EditableThemePalette): ThemeConfig {
  const accentSoft = mixWithWhite(palette.primary, 0.72);
  const accentHover = mixWithBlack(palette.primary, 0.1);
  const accentActive = mixWithBlack(palette.primary, 0.2);

  return {
    cssVar: undefined,
    token: {
      fontFamily:
        "var(--font-plus-jakarta), var(--font-geist-sans), sans-serif",
      fontSize: 14,
      borderRadius: 12,
      borderRadiusLG: 18,
      colorPrimary: palette.primary,
      colorSuccess: palette.success,
      colorWarning: palette.warning,
      colorError: palette.error,
      colorInfo: palette.info,
      controlHeight: 40,
      controlOutline: "transparent",
    },
    components: {
      Menu: {
        itemHeight: 42,
        itemBorderRadius: 10,
        itemMarginInline: 10,
        itemMarginBlock: 6,
      },
      Card: {
        borderRadiusLG: dashboardLayout.cardRadius,
        headerFontSize: 16,
        headerHeight: 54,
        colorBorderSecondary: palette.border,
      },
      Button: {
        borderRadius: 12,
        fontWeight: 600,
        defaultShadow: "none",
        primaryShadow: "none",
        colorPrimaryHover: accentHover,
        colorPrimaryActive: accentActive,
      },
      Input: {
        borderRadius: 12,
        activeBorderColor: accentHover,
        hoverBorderColor: accentHover,
      },
      Select: {
        borderRadius: 12,
        optionSelectedBg: accentSoft,
        activeBorderColor: accentHover,
      },
      Progress: {
        defaultColor: palette.primary,
        remainingColor: mixWithWhite(palette.primary, 0.82),
      },
      Tabs: {
        itemColor: palette.textSecondary,
        itemHoverColor: accentHover,
        itemSelectedColor: accentActive,
        inkBarColor: accentActive,
        cardBg: palette.bgContainer,
        horizontalItemPadding: "10px 14px",
      },
    },
  };
}

export function createDashboardLightTheme(
  palette: EditableThemePalette,
): ThemeConfig {
  const sharedTheme = createSharedTheme(palette);
  const accentSoft = mixWithWhite(palette.primary, 0.72);

  return {
    ...sharedTheme,
    token: {
      ...sharedTheme.token,
      colorPrimary: palette.primary,
      colorBgBase: palette.bgBase,
      colorBgContainer: palette.bgContainer,
      colorTextBase: palette.text,
      colorText: palette.text,
      colorTextSecondary: palette.textSecondary,
      colorBorder: palette.border,
      colorSplit: palette.border,
      boxShadowSecondary: "0 6px 20px rgba(17, 24, 39, 0.08)",
    },
    components: {
      ...sharedTheme.components,
      Layout: {
        bodyBg: palette.bgBase,
        headerBg: palette.bgContainer,
        headerHeight: dashboardLayout.headerHeight,
        siderBg: palette.sidebar,
        triggerBg: palette.sidebar,
        triggerColor: "#FFFFFF",
        lightSiderBg: palette.bgContainer,
      },
      Menu: {
        ...sharedTheme.components?.Menu,
        darkItemBg: palette.sidebar,
        darkItemColor: "rgba(255,255,255,0.76)",
        darkSubMenuItemBg: palette.sidebar,
        darkItemSelectedBg: hexToRgba(palette.primary, 0.22),
        darkItemSelectedColor: mixWithWhite(palette.primary, 0.65),
        darkItemHoverBg: "rgba(255,255,255,0.06)",
        darkItemHoverColor: "#FFFFFF",
      },
      Table: {
        headerBg: "#F8F9FB",
        headerColor: "#4B5464",
        rowHoverBg: accentSoft,
        borderColor: palette.border,
        cellPaddingBlock: 12,
        cellPaddingInline: 12,
      },
      Badge: {
        colorError: palette.error,
      },
    },
  };
}

export function createDashboardDarkTheme(
  palette: EditableThemePalette,
): ThemeConfig {
  const sharedTheme = createSharedTheme(palette);
  const accentSoft = mixWithWhite(palette.primary, 0.25);

  return {
    ...sharedTheme,
    algorithm: antTheme.darkAlgorithm,
    token: {
      ...sharedTheme.token,
      colorPrimary: palette.primary,
      colorBgBase: palette.bgBase,
      colorBgContainer: palette.bgContainer,
      colorTextBase: palette.text,
      colorText: palette.text,
      colorTextSecondary: palette.textSecondary,
      colorBorder: palette.border,
      colorSplit: palette.border,
      boxShadowSecondary: "0 6px 20px rgba(0, 0, 0, 0.35)",
    },
    components: {
      ...sharedTheme.components,
      Layout: {
        bodyBg: palette.bgBase,
        headerBg: palette.bgContainer,
        headerHeight: dashboardLayout.headerHeight,
        siderBg: palette.sidebar,
        triggerBg: palette.sidebar,
        triggerColor: "#FFFFFF",
        lightSiderBg: palette.bgContainer,
      },
      Menu: {
        ...sharedTheme.components?.Menu,
        darkItemBg: palette.sidebar,
        darkItemColor: "rgba(255,255,255,0.76)",
        darkSubMenuItemBg: palette.sidebar,
        darkItemSelectedBg: hexToRgba(palette.primary, 0.22),
        darkItemSelectedColor: mixWithWhite(palette.primary, 0.65),
        darkItemHoverBg: "rgba(255,255,255,0.08)",
        darkItemHoverColor: "#FFFFFF",
      },
      Button: {
        ...sharedTheme.components?.Button,
        colorPrimaryHover: mixWithBlack(palette.primary, 0.12),
        colorPrimaryActive: mixWithBlack(palette.primary, 0.2),
      },
      Input: {
        ...sharedTheme.components?.Input,
        hoverBorderColor: mixWithBlack(palette.primary, 0.12),
        activeBorderColor: mixWithBlack(palette.primary, 0.12),
      },
      Select: {
        ...sharedTheme.components?.Select,
        optionSelectedBg: hexToRgba(palette.primary, 0.22),
        activeBorderColor: mixWithBlack(palette.primary, 0.12),
      },
      Table: {
        headerBg: "#1B1B1B",
        headerColor: "#DADADA",
        rowHoverBg: hexToRgba(palette.primary, 0.18),
        borderColor: palette.border,
        cellPaddingBlock: 12,
        cellPaddingInline: 12,
      },
      Tabs: {
        ...sharedTheme.components?.Tabs,
        itemColor: palette.textSecondary,
        itemHoverColor: accentSoft,
        itemSelectedColor: palette.primary,
        inkBarColor: palette.primary,
        cardBg: palette.bgContainer,
      },
      Badge: {
        colorError: palette.error,
      },
    },
  };
}

export const dashboardLightTheme: ThemeConfig =
  createDashboardLightTheme(defaultLightPalette);
export const dashboardDarkTheme: ThemeConfig =
  createDashboardDarkTheme(defaultDarkPalette);

export default dashboardLightTheme;
