"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";

import ThemeModeSwitcher from "@/components/common/theme-mode-switcher/theme-mode-switcher";
import queryClient from "@/lib/apis/client";
import AuthStoreHydrator from "@/stores/auth/auth-store-hydrator/auth-store-hydrator";
import {
  dashboardDarkTheme,
  dashboardLightTheme,
  type ThemeMode,
} from "@/theme";

type AppProvidersProps = {
  children: ReactNode;
};

const THEME_MODE_STORAGE_KEY = "wm-theme-mode";

function getSystemIsDark() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    function getInitialMode() {
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
    },
  );
  const [isSystemDark, setIsSystemDark] = useState<boolean>(getSystemIsDark);

  useEffect(function watchSystemTheme() {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = function onSystemThemeChange(event: MediaQueryListEvent) {
      setIsSystemDark(event.matches);
    };

    mediaQuery.addEventListener("change", onChange);

    return function cleanup() {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  const resolvedMode =
    themeMode === "system" ? (isSystemDark ? "dark" : "light") : themeMode;

  const activeTheme = useMemo(
    function getActiveTheme() {
      return resolvedMode === "dark" ? dashboardDarkTheme : dashboardLightTheme;
    },
    [resolvedMode],
  );

  const handleChangeThemeMode = function handleChangeThemeMode(
    mode: ThemeMode,
  ) {
    setThemeMode(mode);
    localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
  };

  return (
    <AntdRegistry>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={activeTheme}>
          <AuthStoreHydrator />
          {children}
          <ThemeModeSwitcher
            mode={themeMode}
            onChangeMode={handleChangeThemeMode}
          />
        </ConfigProvider>
      </QueryClientProvider>
    </AntdRegistry>
  );
};

export default AppProviders;
