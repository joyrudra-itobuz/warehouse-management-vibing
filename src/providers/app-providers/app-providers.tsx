"use client";

import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

import theme from "@/theme";

type AppProvidersProps = {
  children: ReactNode;
};

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AntdRegistry>
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </AntdRegistry>
  );
};

export default AppProviders;
