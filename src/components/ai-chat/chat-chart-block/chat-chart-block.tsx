"use client";

import { Column, Line, Pie } from "@ant-design/charts";
import { Typography } from "antd";

import type { ChartBlock } from "@/types/apis/chat/chat-types/chat-types";

type ChatChartBlockProps = {
  data: ChartBlock;
};

const { Text } = Typography;

function buildChartData(chartData: ChartBlock) {
  const rows: { label: string; value: number; series: string }[] = [];

  chartData.datasets.forEach(function processDataset(dataset) {
    chartData.labels.forEach(function processLabel(label, index) {
      rows.push({
        label,
        value: dataset.data[index] ?? 0,
        series: dataset.label,
      });
    });
  });

  return rows;
}

export default function ChatChartBlock({ data }: ChatChartBlockProps) {
  const chartData = buildChartData(data);

  const commonConfig = {
    data: chartData,
    xField: "label",
    yField: "value",
    colorField: "series",
    height: 220,
    autoFit: true,
  };

  return (
    <div style={{ marginTop: 4 }}>
      {data.title ? (
        <Text
          strong
          style={{ display: "block", marginBottom: 6, fontSize: 13 }}
        >
          {data.title}
        </Text>
      ) : null}

      {data.chartType === "line" || data.chartType === "area" ? (
        <Line {...commonConfig} />
      ) : data.chartType === "pie" || data.chartType === "doughnut" ? (
        <Pie
          data={chartData}
          angleField="value"
          colorField="label"
          height={220}
          autoFit
          innerRadius={data.chartType === "doughnut" ? 0.5 : 0}
        />
      ) : (
        // bar (default)
        <Column {...commonConfig} />
      )}
    </div>
  );
}
