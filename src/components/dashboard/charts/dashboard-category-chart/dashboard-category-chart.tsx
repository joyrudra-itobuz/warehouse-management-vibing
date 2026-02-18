"use client";

import { Column } from "@ant-design/charts";
import { Card, Empty, Typography } from "antd";
import type { DashboardChartPoint } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";

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
          height={260}
          data={data}
          xField="label"
          yField="value"
          color="#D6F247"
          xAxis={{ label: { autoRotate: false } }}
          yAxis={{ grid: { line: { style: { stroke: "#E9EDF3" } } } }}
          style={{ marginTop: 10 }}
        />
      )}
    </Card>
  );
}
