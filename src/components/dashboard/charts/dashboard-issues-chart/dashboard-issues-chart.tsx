"use client";

import { Column } from "@ant-design/charts";
import { Card, Empty, Typography, theme } from "antd";

import type { DashboardSeriesChartPoint } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";

const { Text } = Typography;

type DashboardIssuesChartProps = {
  data: DashboardSeriesChartPoint[];
};

export default function DashboardIssuesChart({
  data,
}: DashboardIssuesChartProps) {
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
      <Text strong>Cancelled vs Adjusted Products</Text>
      {data.length === 0 ? (
        <div style={{ marginTop: 16 }}>
          <Empty description="No issue data" />
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, marginTop: 12 }}>
          <Column
            autoFit
            data={data}
            xField="label"
            yField="value"
            seriesField="series"
            group
            color={[token.colorError, token.colorWarning]}
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
