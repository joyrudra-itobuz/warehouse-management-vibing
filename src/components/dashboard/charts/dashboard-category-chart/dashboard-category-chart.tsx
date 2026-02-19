"use client";

import { Column } from "@ant-design/charts";
import { Card, Empty, Typography } from "antd";
import type { DashboardChartPoint } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";
import { dashboardPalette } from "@/theme";

const { Text } = Typography;

type DashboardCategoryChartProps = {
  data: DashboardChartPoint[];
};

export default function DashboardCategoryChart({
  data,
}: DashboardCategoryChartProps) {
  return (
    <Card bordered={false} style={{ borderRadius: 16 }}>
      <Text strong>Inventory by Category</Text>
      {data.length === 0 ? (
        <div style={{ marginTop: 16 }}>
          <Empty description="No chart data" />
        </div>
      ) : (
        <Column
          height={340}
          data={data}
          xField="label"
          yField="value"
          colorField="label"
          scale={{
            color: {
              range: [dashboardPalette.accent, "#CDEB40", "#B7D733", "#E6F69A"],
            },
          }}
          style={{
            radiusTopLeft: 8,
            radiusTopRight: 8,
            stroke: "#FFFFFF",
            lineWidth: 1,
          }}
          xAxis={{ label: { autoRotate: false } }}
          yAxis={{ grid: { line: { style: { stroke: "#E9EDF3" } } } }}
          marginTop={10}
        />
      )}
    </Card>
  );
}
