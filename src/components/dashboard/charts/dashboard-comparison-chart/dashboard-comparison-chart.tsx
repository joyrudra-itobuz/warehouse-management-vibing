"use client";

import { Line } from "@ant-design/charts";
import { Card, Empty, Typography } from "antd";
import type { DashboardSeriesChartPoint } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";
import { dashboardPalette } from "@/theme";

const { Text } = Typography;

type DashboardComparisonChartProps = {
  data: DashboardSeriesChartPoint[];
};

export default function DashboardComparisonChart({
  data,
}: DashboardComparisonChartProps) {
  return (
    <Card bordered={false} style={{ borderRadius: 16 }}>
      <Text strong>Product Transaction (IN vs OUT)</Text>
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
          seriesField="series"
          color={[dashboardPalette.accent, "#8FB4FF"]}
          point={{
            size: 4,
            shape: "circle",
            style: {
              fill: dashboardPalette.surface,
              stroke: "#FFFFFF",
              lineWidth: 1,
            },
          }}
          area={{
            style: {
              fill: "l(270) 0:rgba(214,242,71,0.24) 1:rgba(214,242,71,0.02)",
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
