"use client";

import { Card, Statistic, Tag, Typography } from "antd";

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
  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 16,
        background: highlighted ? "#171A23" : "#FFFFFF",
      }}
      bodyStyle={{ padding: 18 }}
    >
      <Text
        style={{ color: highlighted ? "rgba(255,255,255,0.72)" : undefined }}
      >
        {title}
      </Text>
      <Statistic
        value={value}
        valueStyle={{
          marginTop: 8,
          color: highlighted ? "#FFFFFF" : undefined,
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
