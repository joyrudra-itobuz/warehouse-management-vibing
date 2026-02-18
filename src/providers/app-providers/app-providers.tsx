"use client";

import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";

import queryClient from "@/lib/apis/client";
import theme from "@/theme";

type AppProvidersProps = {
  children: ReactNode;
};

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AntdRegistry>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
      </QueryClientProvider>
    </AntdRegistry>
  );
};

export default AppProviders;
