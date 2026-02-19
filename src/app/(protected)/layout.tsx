"use client";

import type { ReactNode } from "react";
import { Layout } from "antd";

import ProtectedRouteGuard from "@/components/auth/common/protected-route-guard/protected-route-guard";
import DashboardSidebar from "@/components/dashboard/layout/dashboard-sidebar/dashboard-sidebar";

type ProtectedLayoutProps = {
  children: ReactNode;
};

const { Content } = Layout;

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <ProtectedRouteGuard>
      <Layout style={{ minHeight: "100vh" }}>
        <DashboardSidebar />
        <Layout style={{ minHeight: "100vh" }}>
          <Content style={{ padding: 24 }}>{children}</Content>
        </Layout>
      </Layout>
    </ProtectedRouteGuard>
  );
}
