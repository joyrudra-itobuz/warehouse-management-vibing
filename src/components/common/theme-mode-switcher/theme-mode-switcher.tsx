"use client";

import { DesktopOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";

import { usePreferencesStore } from "@/stores/preferences";

export default function ThemeModeSwitcher() {
  const themeMode = usePreferencesStore((state) => state.themeMode);
  const setThemeMode = usePreferencesStore((state) => state.setThemeMode);

  return (
    <Space size={4}>
      <Tooltip title="Light">
        <Button
          shape="circle"
          type="text"
          icon={<SunOutlined />}
          aria-label="Set light theme"
          onClick={function onClickLight() {
            setThemeMode("light");
          }}
          style={{
            color: "rgba(255, 255, 255, 0.92)",
            background:
              themeMode === "light" ? "rgba(255, 255, 255, 0.18)" : undefined,
          }}
        />
      </Tooltip>
      <Tooltip title="Dark">
        <Button
          shape="circle"
          type="text"
          icon={<MoonOutlined />}
          aria-label="Set dark theme"
          onClick={function onClickDark() {
            setThemeMode("dark");
          }}
          style={{
            color: "rgba(255, 255, 255, 0.92)",
            background:
              themeMode === "dark" ? "rgba(255, 255, 255, 0.18)" : undefined,
          }}
        />
      </Tooltip>
      <Tooltip title="System">
        <Button
          shape="circle"
          type="text"
          icon={<DesktopOutlined />}
          aria-label="Set system theme"
          onClick={function onClickSystem() {
            setThemeMode("system");
          }}
          style={{
            color: "rgba(255, 255, 255, 0.92)",
            background:
              themeMode === "system" ? "rgba(255, 255, 255, 0.18)" : undefined,
          }}
        />
      </Tooltip>
    </Space>
  );
}
