"use client";

import { Card, Skeleton, Space, Statistic, Tag, Typography, theme } from "antd";
import AccentSkeletonThemeProvider from "@/components/common/accent-skeleton-theme-provider/accent-skeleton-theme-provider";

const { Text } = Typography;

type DashboardStatCardProps = {
  title: string;
  value: string | number;
  trend?: string | number;
  highlighted?: boolean;
  loading?: boolean;
};

export default function DashboardStatCard({
  title,
  value,
  trend,
  highlighted,
  loading,
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
      {loading ? (
        <AccentSkeletonThemeProvider>
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <Skeleton.Input active size="small" style={{ width: "45%" }} />
            <Skeleton.Input active size="large" style={{ width: "75%" }} />
            <Skeleton.Button active size="small" style={{ width: 90 }} />
          </Space>
        </AccentSkeletonThemeProvider>
      ) : (
        <>
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
        </>
      )}
    </Card>
  );
}
