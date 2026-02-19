"use client";

import { Card, Statistic, Tag, Typography, theme } from "antd";

const { Text } = Typography;

type DashboardStatCardProps = {
  title: string;
  value: string | number;
  trend?: string | number;
  highlighted?: boolean;
};

export default function DashboardStatCard({
  title,
  value,
  trend,
  highlighted,
}: DashboardStatCardProps) {
  const { token } = theme.useToken();
  const isDarkMode = token.colorBgBase === "#090909";
  const highlightedBackground = isDarkMode ? "#1E1E1E" : "#111111";

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 16,
        background: highlighted
          ? highlightedBackground
          : token.colorBgContainer,
      }}
      bodyStyle={{ padding: 18 }}
    >
      <Text
        style={{
          color: highlighted
            ? "rgba(255,255,255,0.82)"
            : token.colorTextSecondary,
        }}
      >
        {title}
      </Text>
      <Statistic
        value={value}
        valueStyle={{
          marginTop: 8,
          color: highlighted ? "#FFFFFF" : token.colorText,
          fontSize: 30,
          fontWeight: 700,
        }}
      />
      {trend ? (
        <Tag
          color={highlighted ? "success" : "green"}
          style={{ marginTop: 10 }}
        >
          {trend}
        </Tag>
      ) : null}
    </Card>
  );
}
