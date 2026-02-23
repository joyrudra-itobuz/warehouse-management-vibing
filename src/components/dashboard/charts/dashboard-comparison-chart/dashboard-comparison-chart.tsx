"use client";

import { Line } from "@ant-design/charts";
import { Card, Empty, Typography, theme } from "antd";
import type { DashboardSeriesChartPoint } from "@/types/apis/dashboard/dashboard-response-types/dashboard-response-types";

const { Text } = Typography;

type DashboardComparisonChartProps = {
  data: DashboardSeriesChartPoint[];
};

export default function DashboardComparisonChart({
  data,
}: DashboardComparisonChartProps) {
  const { token } = theme.useToken();
  const isDarkMode = token.colorBgBase === "#090909";

  return (
    <Card bordered={false} style={{ borderRadius: 16 }}>
      <Text strong>Product Transaction (IN vs OUT)</Text>
      {data.length === 0 ? (
        <div style={{ marginTop: 16 }}>
          <Empty description="No trend data" />
        </div>
      ) : (
        <Line
          height={340}
          data={data}
          xField="label"
          yField="value"
          seriesField="series"
          color={[token.colorPrimary, "#8FB4FF"]}
          point={{
            size: 4,
            shape: "circle",
            style: {
              fill: token.colorBgContainer,
              stroke: token.colorBgContainer,
              lineWidth: 1,
            },
          }}
          area={{
            style: {
              fill: "l(270) 0:rgba(214,242,71,0.24) 1:rgba(214,242,71,0.02)",
            },
          }}
          xAxis={{
            label: {
              style: { fill: token.colorTextSecondary },
            },
          }}
          yAxis={{
            label: { style: { fill: token.colorTextSecondary } },
            grid: { line: { style: { stroke: token.colorBorder } } },
          }}
          legend={{ itemName: { style: { fill: token.colorTextSecondary } } }}
          theme={isDarkMode ? "classicDark" : "classic"}
          smooth
          marginTop={10}
        />
      )}
    </Card>
  );
}
