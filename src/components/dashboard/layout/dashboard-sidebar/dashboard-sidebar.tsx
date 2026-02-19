"use client";

import { Button, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
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
};

const menuItems: MenuProps["items"] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "inventory", label: "Inventory" },
  { key: "transactions", label: "Transactions" },
  { key: "customers", label: "Customers", disabled: true },
  { key: "report", label: "Report", disabled: true },
];

export default function DashboardSidebar({
  selectedKey,
}: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);

  const resolvedSelectedKey =
    selectedKey ??
    (pathname.startsWith("/inventory")
      ? "inventory"
      : pathname.startsWith("/transactions")
        ? "transactions"
        : "dashboard");

  const handleLogout = function handleLogout() {
    clearAuthSession();
    router.replace("/auth/login");
  };

  return (
    <Sider
      width={240}
      breakpoint="lg"
      collapsedWidth={72}
      style={{
        minHeight: "100vh",
        height: "100vh",
        position: "sticky",
        top: 0,
        insetInlineStart: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <div
          style={{ padding: "20px 18px", color: "#D6F247", fontWeight: 700 }}
        >
          vault
        </div>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[resolvedSelectedKey]}
          items={menuItems}
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
                minWidth: 132,
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
