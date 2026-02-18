"use client";

import type { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";

import queryClient from "@/lib/apis/client";
import AuthStoreHydrator from "@/stores/auth/auth-store-hydrator/auth-store-hydrator";
import theme from "@/theme";

type AppProvidersProps = {
  children: ReactNode;
};

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AntdRegistry>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={theme}>
          <AuthStoreHydrator />
          {children}
        </ConfigProvider>
      </QueryClientProvider>
    </AntdRegistry>
  );
};

export default AppProviders;
