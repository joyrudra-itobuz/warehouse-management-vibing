"use client";

import type { ReactNode } from "react";
import { ConfigProvider, theme } from "antd";

type AccentSkeletonThemeProviderProps = {
  children: ReactNode;
};

export default function AccentSkeletonThemeProvider({
  children,
}: AccentSkeletonThemeProviderProps) {
  const { token } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorFillContent: token.colorPrimaryBg,
          colorFillSecondary: token.colorPrimaryBgHover,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
