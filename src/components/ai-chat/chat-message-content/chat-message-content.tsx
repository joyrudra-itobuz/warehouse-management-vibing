"use client";

import { Typography } from "antd";

import ChatChartBlock from "@/components/ai-chat/chat-chart-block/chat-chart-block";
import ChatMetricBlock from "@/components/ai-chat/chat-metric-block/chat-metric-block";
import ChatTableBlock from "@/components/ai-chat/chat-table-block/chat-table-block";
import type {
  ChartBlock,
  MetricBlock,
  ParsedChatResponse,
  TableBlock,
} from "@/types/apis/chat/chat-types/chat-types";

type ChatMessageContentProps = {
  content: string;
  parsed?: ParsedChatResponse;
};

const { Paragraph, Text, Title } = Typography;

function renderRaw(text: string) {
  return (
    <Paragraph
      style={{
        fontSize: 13,
        lineHeight: 1.6,
        margin: 0,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {text}
    </Paragraph>
  );
}

export default function ChatMessageContent({
  content,
  parsed,
}: ChatMessageContentProps) {
  // If no parsed response, render the raw string
  if (
    !parsed ||
    (!parsed.summary &&
      parsed.insights.length === 0 &&
      parsed.data.length === 0)
  ) {
    return renderRaw(content || parsed?.raw || "");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Summary */}
      {parsed.summary ? (
        <Paragraph style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>
          {parsed.summary}
        </Paragraph>
      ) : null}

      {/* Insights */}
      {parsed.insights.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {parsed.insights.map(function renderInsight(insight, idx) {
            return (
              <li key={idx} style={{ fontSize: 13, lineHeight: 1.6 }}>
                {insight}
              </li>
            );
          })}
        </ul>
      ) : null}

      {/* Data blocks */}
      {parsed.data.map(function renderBlock(block, idx) {
        if (block.type === "text") {
          return (
            <Paragraph
              key={idx}
              style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}
            >
              {block.content as string}
            </Paragraph>
          );
        }

        if (block.type === "metric") {
          return (
            <ChatMetricBlock key={idx} data={block.content as MetricBlock} />
          );
        }

        if (block.type === "table") {
          return (
            <ChatTableBlock key={idx} data={block.content as TableBlock} />
          );
        }

        if (block.type === "chart") {
          return (
            <ChatChartBlock key={idx} data={block.content as ChartBlock} />
          );
        }

        return null;
      })}
    </div>
  );
}
