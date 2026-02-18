"use client";

import { Line } from "@ant-design/charts";
import { Card, Empty, Typography } from "antd";
import type { DashboardChartPoint } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";

const { Text } = Typography;

type DashboardComparisonChartProps = {
  data: DashboardChartPoint[];
};

export default function DashboardComparisonChart({
  data,
}: DashboardComparisonChartProps) {
  return (
    <Card bordered={false} style={{ borderRadius: 16 }}>
      <Text strong>Product Trend Comparison</Text>
      {data.length === 0 ? (
        <div style={{ marginTop: 16 }}>
          <Empty description="No trend data" />
        </div>
      ) : (
        <Line
          height={260}
          data={data}
          xField="label"
          yField="value"
          color="#A9C125"
          point={{ size: 4, shape: "circle" }}
          smooth
          style={{ marginTop: 10 }}
        />
      )}
    </Card>
  );
}
