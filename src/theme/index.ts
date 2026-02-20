import type { ThemeConfig } from "antd";
import { theme as antTheme } from "antd";

export const dashboardPalette = {
  accent: "#8FAA30",
  darkAccent: "#9BBC3D",
  canvas: "#F2F2F2",
  surface: "#FFFFFF",
  sidebar: "#111111",
  text: "#111111",
  textSecondary: "#555555",
  border: "#E2E2E2",
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

export type ThemeMode = "light" | "dark" | "system";

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

function createSharedTheme(accent: string): ThemeConfig {
  const accentSoft = mixWithWhite(accent, 0.72);
  const accentHover = mixWithBlack(accent, 0.1);
  const accentActive = mixWithBlack(accent, 0.2);

  return {
    cssVar: undefined,
    token: {
      fontFamily:
        "var(--font-plus-jakarta), var(--font-geist-sans), sans-serif",
      fontSize: 14,
      borderRadius: 12,
      borderRadiusLG: 18,
      colorPrimary: accent,
      colorSuccess: dashboardPalette.success,
      colorWarning: dashboardPalette.warning,
      colorError: dashboardPalette.error,
      colorInfo: dashboardPalette.info,
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
        colorBorderSecondary: dashboardPalette.border,
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
        defaultColor: accent,
        remainingColor: mixWithWhite(accent, 0.82),
      },
      Tabs: {
        itemColor: dashboardPalette.textSecondary,
        itemHoverColor: accentHover,
        itemSelectedColor: accentActive,
        inkBarColor: accentActive,
        cardBg: dashboardPalette.surface,
        horizontalItemPadding: "10px 14px",
      },
    },
  };
}

export function createDashboardLightTheme(accent: string): ThemeConfig {
  const sharedTheme = createSharedTheme(accent);
  const accentSoft = mixWithWhite(accent, 0.72);

  return {
    ...sharedTheme,
    token: {
      ...sharedTheme.token,
      colorPrimary: accent,
      colorBgBase: dashboardPalette.canvas,
      colorBgContainer: dashboardPalette.surface,
      colorTextBase: dashboardPalette.text,
      colorText: dashboardPalette.text,
      colorTextSecondary: dashboardPalette.textSecondary,
      colorBorder: dashboardPalette.border,
      colorSplit: dashboardPalette.border,
      boxShadowSecondary: "0 6px 20px rgba(17, 24, 39, 0.08)",
    },
    components: {
      ...sharedTheme.components,
      Layout: {
        bodyBg: dashboardPalette.canvas,
        headerBg: dashboardPalette.surface,
        headerHeight: dashboardLayout.headerHeight,
        siderBg: dashboardPalette.sidebar,
        triggerBg: dashboardPalette.sidebar,
        triggerColor: "#FFFFFF",
        lightSiderBg: dashboardPalette.surface,
      },
      Menu: {
        ...sharedTheme.components?.Menu,
        darkItemBg: dashboardPalette.sidebar,
        darkItemColor: "rgba(255,255,255,0.76)",
        darkSubMenuItemBg: dashboardPalette.sidebar,
        darkItemSelectedBg: "rgba(143, 170, 48, 0.22)",
        darkItemSelectedColor: "#DDEAA6",
        darkItemHoverBg: "rgba(255,255,255,0.06)",
        darkItemHoverColor: "#FFFFFF",
      },
      Table: {
        headerBg: "#F8F9FB",
        headerColor: "#4B5464",
        rowHoverBg: accentSoft,
        borderColor: dashboardPalette.border,
        cellPaddingBlock: 12,
        cellPaddingInline: 12,
      },
      Badge: {
        colorError: dashboardPalette.error,
      },
    },
  };
}

export function createDashboardDarkTheme(accent: string): ThemeConfig {
  const sharedTheme = createSharedTheme(accent);
  const accentSoft = mixWithWhite(accent, 0.25);

  return {
    ...sharedTheme,
    algorithm: antTheme.darkAlgorithm,
    token: {
      ...sharedTheme.token,
      colorPrimary: accent,
      colorBgBase: "#090909",
      colorBgContainer: "#151515",
      colorTextBase: "#F4F4F4",
      colorText: "#F4F4F4",
      colorTextSecondary: "#B7B7B7",
      colorBorder: "#2A2A2A",
      colorSplit: "#2A2A2A",
      boxShadowSecondary: "0 6px 20px rgba(0, 0, 0, 0.35)",
    },
    components: {
      ...sharedTheme.components,
      Layout: {
        bodyBg: "#090909",
        headerBg: "#151515",
        headerHeight: dashboardLayout.headerHeight,
        siderBg: "#191919",
        triggerBg: "#191919",
        triggerColor: "#FFFFFF",
        lightSiderBg: "#151515",
      },
      Menu: {
        ...sharedTheme.components?.Menu,
        darkItemBg: "#191919",
        darkItemColor: "rgba(255,255,255,0.76)",
        darkSubMenuItemBg: "#191919",
        darkItemSelectedBg: "rgba(155, 188, 61, 0.22)",
        darkItemSelectedColor: "#E4F2B7",
        darkItemHoverBg: "rgba(255,255,255,0.08)",
        darkItemHoverColor: "#FFFFFF",
      },
      Button: {
        ...sharedTheme.components?.Button,
        colorPrimaryHover: mixWithBlack(accent, 0.12),
        colorPrimaryActive: mixWithBlack(accent, 0.2),
      },
      Input: {
        ...sharedTheme.components?.Input,
        hoverBorderColor: mixWithBlack(accent, 0.12),
        activeBorderColor: mixWithBlack(accent, 0.12),
      },
      Select: {
        ...sharedTheme.components?.Select,
        optionSelectedBg: hexToRgba(accent, 0.22),
        activeBorderColor: mixWithBlack(accent, 0.12),
      },
      Table: {
        headerBg: "#1B1B1B",
        headerColor: "#DADADA",
        rowHoverBg: hexToRgba(accent, 0.18),
        borderColor: "#2A2A2A",
        cellPaddingBlock: 12,
        cellPaddingInline: 12,
      },
      Tabs: {
        ...sharedTheme.components?.Tabs,
        itemColor: "#B7B7B7",
        itemHoverColor: accentSoft,
        itemSelectedColor: accent,
        inkBarColor: accent,
        cardBg: "#151515",
      },
      Badge: {
        colorError: dashboardPalette.error,
      },
    },
  };
}

export const dashboardLightTheme: ThemeConfig = createDashboardLightTheme(
  dashboardPalette.accent,
);

export const dashboardDarkTheme: ThemeConfig = createDashboardDarkTheme(
  dashboardPalette.darkAccent,
);

export default dashboardLightTheme;
