"use client";

import { Column } from "@ant-design/charts";
import { Card, Empty, Typography, theme } from "antd";
import type { DashboardChartPoint } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";

const { Text } = Typography;

type DashboardCategoryChartProps = {
  data: DashboardChartPoint[];
};

export default function DashboardCategoryChart({
  data,
}: DashboardCategoryChartProps) {
  const { token } = theme.useToken();
  const isDarkMode = token.colorBgBase === "#090909";

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 16,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      styles={{
        body: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: 16,
        },
      }}
    >
      <Text strong>Inventory by Category</Text>
      {data.length === 0 ? (
        <div style={{ marginTop: 16 }}>
          <Empty description="No chart data" />
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, marginTop: 12 }}>
          <Column
            autoFit
            data={data}
            xField="label"
            yField="value"
            colorField="label"
            scale={{
              color: {
                range: [token.colorPrimary, "#CDEB40", "#B7D733", "#E6F69A"],
              },
            }}
            style={{
              radiusTopLeft: 8,
              radiusTopRight: 8,
              stroke: token.colorBgContainer,
              lineWidth: 1,
            }}
            xAxis={{
              label: {
                autoRotate: false,
                style: { fill: token.colorTextSecondary },
              },
            }}
            yAxis={{
              label: { style: { fill: token.colorTextSecondary } },
              grid: { line: { style: { stroke: token.colorBorder } } },
            }}
            legend={{ itemName: { style: { fill: token.colorTextSecondary } } }}
            theme={isDarkMode ? "classicDark" : "classic"}
            marginTop={10}
          />
        </div>
      )}
    </Card>
  );
}
