"use client";

import { DesktopOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Card, Segmented, Space, Typography } from "antd";

import type { ThemeMode } from "@/theme";

const { Text } = Typography;

type ThemeModeSwitcherProps = {
  mode: ThemeMode;
  onChangeMode: (mode: ThemeMode) => void;
};

export default function ThemeModeSwitcher({
  mode,
  onChangeMode,
}: ThemeModeSwitcherProps) {
  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 1100,
      }}
    >
      <Card size="small" styles={{ body: { padding: 10 } }}>
        <Space direction="vertical" size={8}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Theme
          </Text>
          <Segmented<ThemeMode>
            value={mode}
            onChange={function onChange(nextValue) {
              onChangeMode(nextValue as ThemeMode);
            }}
            options={[
              {
                label: (
                  <Space size={6}>
                    <SunOutlined />
                    <span>Light</span>
                  </Space>
                ),
                value: "light",
              },
              {
                label: (
                  <Space size={6}>
                    <MoonOutlined />
                    <span>Dark</span>
                  </Space>
                ),
                value: "dark",
              },
              {
                label: (
                  <Space size={6}>
                    <DesktopOutlined />
                    <span>System</span>
                  </Space>
                ),
                value: "system",
              },
            ]}
          />
        </Space>
      </Card>
    </div>
  );
}
