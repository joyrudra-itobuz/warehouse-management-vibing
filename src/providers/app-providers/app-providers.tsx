"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";

import queryClient from "@/lib/apis/client";
import AuthStoreHydrator from "@/stores/auth/auth-store-hydrator/auth-store-hydrator";
import { usePreferencesStore } from "@/stores/preferences";
import {
  createDashboardDarkTheme,
  createDashboardLightTheme,
} from "@/theme/index";

type AppProvidersProps = {
  children: ReactNode;
};

function getSystemIsDark() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function AppProviders({ children }: AppProvidersProps) {
  const themeMode = usePreferencesStore((state) => state.themeMode);
  const lightPalette = usePreferencesStore((state) => state.lightPalette);
  const darkPalette = usePreferencesStore((state) => state.darkPalette);
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
      return resolvedMode === "dark"
        ? createDashboardDarkTheme(darkPalette)
        : createDashboardLightTheme(lightPalette);
    },
    [darkPalette, lightPalette, resolvedMode],
  );

  return (
    <AntdRegistry>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={activeTheme}>
          <AuthStoreHydrator />
          {children}
        </ConfigProvider>
      </QueryClientProvider>
    </AntdRegistry>
  );
}
