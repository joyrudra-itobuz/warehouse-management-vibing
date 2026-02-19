import type { ThemeConfig } from "antd";
import { theme as antTheme } from "antd";

export const dashboardPalette = {
  accent: "#8FAA30",
  accentSoft: "#EAF3CB",
  accentHover: "#7D9829",
  accentActive: "#6B8322",
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

const sharedTheme: ThemeConfig = {
  cssVar: undefined,
  token: {
    fontFamily: "var(--font-plus-jakarta), var(--font-geist-sans), sans-serif",
    fontSize: 14,
    borderRadius: 12,
    borderRadiusLG: 18,
    colorPrimary: dashboardPalette.accent,
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
      colorPrimaryHover: dashboardPalette.accentHover,
      colorPrimaryActive: dashboardPalette.accentActive,
    },
    Input: {
      borderRadius: 12,
      activeBorderColor: dashboardPalette.accentHover,
      hoverBorderColor: dashboardPalette.accentHover,
    },
    Select: {
      borderRadius: 12,
      optionSelectedBg: dashboardPalette.accentSoft,
      activeBorderColor: dashboardPalette.accentHover,
    },
    Progress: {
      defaultColor: dashboardPalette.accent,
      remainingColor: "#EDF1D4",
    },
    Tabs: {
      itemColor: dashboardPalette.textSecondary,
      itemHoverColor: "#688120",
      itemSelectedColor: "#566B19",
      inkBarColor: "#566B19",
      cardBg: dashboardPalette.surface,
      horizontalItemPadding: "10px 14px",
    },
  },
};

export const dashboardLightTheme: ThemeConfig = {
  ...sharedTheme,
  token: {
    ...sharedTheme.token,
    colorPrimary: dashboardPalette.accent,
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
      rowHoverBg: dashboardPalette.accentSoft,
      borderColor: dashboardPalette.border,
      cellPaddingBlock: 12,
      cellPaddingInline: 12,
    },
    Badge: {
      colorError: dashboardPalette.error,
    },
  },
};

export const dashboardDarkTheme: ThemeConfig = {
  ...sharedTheme,
  algorithm: antTheme.darkAlgorithm,
  token: {
    ...sharedTheme.token,
    colorPrimary: "#9BBC3D",
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
      colorPrimaryHover: "#88A934",
      colorPrimaryActive: "#76922D",
    },
    Input: {
      ...sharedTheme.components?.Input,
      hoverBorderColor: "#88A934",
      activeBorderColor: "#88A934",
    },
    Select: {
      ...sharedTheme.components?.Select,
      optionSelectedBg: "rgba(155, 188, 61, 0.22)",
      activeBorderColor: "#88A934",
    },
    Table: {
      headerBg: "#1B1B1B",
      headerColor: "#DADADA",
      rowHoverBg: "rgba(155, 188, 61, 0.16)",
      borderColor: "#2A2A2A",
      cellPaddingBlock: 12,
      cellPaddingInline: 12,
    },
    Tabs: {
      ...sharedTheme.components?.Tabs,
      itemColor: "#B7B7B7",
      itemHoverColor: "#A7C84D",
      itemSelectedColor: "#B7D85C",
      inkBarColor: "#B7D85C",
      cardBg: "#151515",
    },
    Badge: {
      colorError: dashboardPalette.error,
    },
  },
};

export default dashboardLightTheme;
