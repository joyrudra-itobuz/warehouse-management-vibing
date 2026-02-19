"use client";

import { Column } from "@ant-design/charts";
import { Card, Empty, Typography } from "antd";

import { dashboardPalette } from "@/theme";
import type { DashboardSeriesChartPoint } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";

const { Text } = Typography;

type DashboardIssuesChartProps = {
  data: DashboardSeriesChartPoint[];
};

export default function DashboardIssuesChart({
  data,
}: DashboardIssuesChartProps) {
  return (
    <Card bordered={false} style={{ borderRadius: 16 }}>
      <Text strong>Cancelled vs Adjusted Products</Text>
      {data.length === 0 ? (
        <div style={{ marginTop: 16 }}>
          <Empty description="No issue data" />
        </div>
      ) : (
        <Column
          height={260}
          data={data}
          xField="label"
          yField="value"
          seriesField="series"
          group
          color={[dashboardPalette.error, dashboardPalette.warning]}
          xAxis={{ label: { autoRotate: false } }}
          yAxis={{ grid: { line: { style: { stroke: "#E9EDF3" } } } }}
          marginTop={10}
        />
      )}
    </Card>
  );
}
