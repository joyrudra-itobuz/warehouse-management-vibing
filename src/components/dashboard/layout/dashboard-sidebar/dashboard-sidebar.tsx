"use client";

import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";

const { Sider } = Layout;

type DashboardSidebarProps = {
  selectedKey: string;
};

const menuItems: MenuProps["items"] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "inventory", label: "Inventory" },
  { key: "shipment", label: "Shipment" },
  { key: "customers", label: "Customers" },
  { key: "report", label: "Report" },
];

export default function DashboardSidebar({
  selectedKey,
}: DashboardSidebarProps) {
  return (
    <Sider
      width={240}
      breakpoint="lg"
      collapsedWidth={72}
      style={{ minHeight: "100vh" }}
    >
      <div style={{ padding: "20px 18px", color: "#D6F247", fontWeight: 700 }}>
        vault
      </div>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[selectedKey]}
        items={menuItems}
        style={{ borderInlineEnd: "none", paddingTop: 8 }}
      />
    </Sider>
  );
}
