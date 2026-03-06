"use client";

import { Card, Statistic, Typography } from "antd";

import type { MetricBlock } from "@/types/apis/chat/chat-types/chat-types";

type ChatMetricBlockProps = {
  data: MetricBlock;
};

const { Text } = Typography;

export default function ChatMetricBlock({ data }: ChatMetricBlockProps) {
  const isPositive = data.change ? data.change.startsWith("+") : undefined;

  const changeColor =
    isPositive === true
      ? "#52c41a"
      : isPositive === false
        ? "#ff4d4f"
        : undefined;

  return (
    <Card size="small" style={{ borderRadius: 8, minWidth: 140 }}>
      <Statistic
        title={data.label}
        value={data.value}
        suffix={
          data.change ? (
            <Text style={{ fontSize: 12, color: changeColor }}>
              {data.change}
            </Text>
          ) : undefined
        }
        valueStyle={{ fontSize: 18, fontWeight: 600 }}
      />
    </Card>
  );
}
