"use client";

import { useState } from "react";
import { Button, Layout, Menu, Tooltip } from "antd";
import type { MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import {
  DashboardOutlined,
  InboxOutlined,
  SwapOutlined,
  SettingOutlined,
  TeamOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { FiLogOut } from "react-icons/fi";

import ThemeModeSwitcher from "@/components/common/theme-mode-switcher/theme-mode-switcher";
import { useAuthStore } from "@/stores/auth";

const { Sider } = Layout;

type DashboardSidebarProps = {
  selectedKey?: string;
};

const sidebarRoutes: Record<string, string> = {
  dashboard: "/dashboard",
  inventory: "/inventory",
  transactions: "/transactions",
  settings: "/settings",
};

const menuItems: MenuProps["items"] = [
  { key: "dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
  { key: "inventory", label: "Inventory", icon: <InboxOutlined /> },
  { key: "transactions", label: "Transactions", icon: <SwapOutlined /> },
  { key: "settings", label: "Settings", icon: <SettingOutlined /> },
  {
    key: "customers",
    label: "Customers",
    icon: <TeamOutlined />,
    disabled: true,
  },
  {
    key: "report",
    label: "Report",
    icon: <BarChartOutlined />,
    disabled: true,
  },
];

export default function DashboardSidebar({
  selectedKey,
}: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);
  const [collapsed, setCollapsed] = useState(false);

  const resolvedSelectedKey =
    selectedKey ??
    (pathname.startsWith("/inventory")
      ? "inventory"
      : pathname.startsWith("/transactions")
        ? "transactions"
        : pathname.startsWith("/settings")
          ? "settings"
          : "dashboard");

  const handleLogout = function handleLogout() {
    clearAuthSession();
    router.replace("/auth/login");
  };

  return (
    <Sider
      width={240}
      collapsedWidth={72}
      collapsed={collapsed}
      onCollapse={(val) => setCollapsed(val)}
      style={{
        minHeight: "100vh",
        height: "100vh",
        position: "sticky",
        top: 0,
        insetInlineStart: 0,
        overflow: "hidden",
        transition: "width 0.2s",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Logo + collapse toggle */}
        <div
          style={{
            padding: "14px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            flexShrink: 0,
            minHeight: 56,
          }}
        >
          {!collapsed && (
            <span
              style={{
                color: "#D6F247",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: 1,
              }}
            >
              vault
            </span>
          )}
          <Button
            type="text"
            size="small"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((c) => !c)}
            style={{ color: "rgba(255,255,255,0.55)", flexShrink: 0 }}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          />
        </div>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[resolvedSelectedKey]}
          items={menuItems}
          inlineCollapsed={collapsed}
          onClick={function onClickMenuItem({ key }) {
            const route = sidebarRoutes[String(key)];

            if (route) {
              router.push(route);
            }
          }}
          style={{ borderInlineEnd: "none", paddingTop: 8, flex: 1 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: "12px 10px 16px",
          }}
        >
          {collapsed ? (
            <Tooltip title="Logout" placement="right">
              <Button
                type="text"
                icon={<FiLogOut size={16} />}
                onClick={handleLogout}
                style={{
                  color: "rgba(255,255,255,0.9)",
                  width: 44,
                  height: 44,
                }}
              />
            </Tooltip>
          ) : (
            <Button
              type="text"
              icon={<FiLogOut size={16} />}
              onClick={handleLogout}
              style={{
                color: "rgba(255,255,255,0.9)",
                width: "100%",
                maxWidth: 132,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 999,
              }}
            >
              Logout
            </Button>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 999,
                padding: "6px 8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minWidth: collapsed ? 0 : 132,
              }}
            >
              <ThemeModeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </Sider>
  );
}
