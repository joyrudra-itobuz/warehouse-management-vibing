"use client";

import { Line } from "@ant-design/charts";
import { Card, Empty, Typography } from "antd";
import type { DashboardChartPoint } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";
import { dashboardPalette } from "@/theme";

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
          color={dashboardPalette.accent}
          point={{
            size: 4,
            shape: "circle",
            style: {
              fill: dashboardPalette.accent,
              stroke: "#FFFFFF",
              lineWidth: 1,
            },
          }}
          area={{
            style: {
              fill: "l(270) 0:rgba(214,242,71,0.35) 1:rgba(214,242,71,0.02)",
            },
          }}
          yAxis={{ grid: { line: { style: { stroke: "#E9EDF3" } } } }}
          smooth
          marginTop={10}
        />
      )}
    </Card>
  );
}
