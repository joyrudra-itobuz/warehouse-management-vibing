import type { ThemeConfig } from "antd";

export const dashboardPalette = {
  accent: "#D6F247",
  accentSoft: "#F1F9CC",
  canvas: "#F5F6F8",
  surface: "#FFFFFF",
  sidebar: "#14161F",
  text: "#151821",
  textSecondary: "#717784",
  border: "#E7EAF0",
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

const theme: ThemeConfig = {
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
    colorBgBase: dashboardPalette.canvas,
    colorBgContainer: dashboardPalette.surface,
    colorTextBase: dashboardPalette.text,
    colorText: dashboardPalette.text,
    colorTextSecondary: dashboardPalette.textSecondary,
    colorBorder: dashboardPalette.border,
    colorSplit: dashboardPalette.border,
    controlHeight: 40,
    controlOutline: "transparent",
    boxShadowSecondary: "0 6px 20px rgba(17, 24, 39, 0.08)",
  },
  components: {
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
      itemHeight: 42,
      darkItemBg: dashboardPalette.sidebar,
      darkItemColor: "rgba(255,255,255,0.76)",
      darkSubMenuItemBg: dashboardPalette.sidebar,
      darkItemSelectedBg: "rgba(214, 242, 71, 0.18)",
      darkItemSelectedColor: dashboardPalette.accent,
      darkItemHoverBg: "rgba(255,255,255,0.04)",
      darkItemHoverColor: "#FFFFFF",
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
      colorPrimaryHover: "#C9E53C",
      colorPrimaryActive: "#B9D62F",
    },
    Input: {
      borderRadius: 12,
      activeBorderColor: dashboardPalette.accent,
      hoverBorderColor: "#C7CDD8",
    },
    Select: {
      borderRadius: 12,
      optionSelectedBg: dashboardPalette.accentSoft,
      activeBorderColor: dashboardPalette.accent,
    },
    Table: {
      headerBg: "#F8F9FB",
      headerColor: "#4B5464",
      rowHoverBg: dashboardPalette.accentSoft,
      borderColor: dashboardPalette.border,
      cellPaddingBlock: 12,
      cellPaddingInline: 12,
    },
    Progress: {
      defaultColor: dashboardPalette.accent,
      remainingColor: "#EDF1D4",
    },
    Badge: {
      colorError: dashboardPalette.error,
    },
  },
};

export default theme;
