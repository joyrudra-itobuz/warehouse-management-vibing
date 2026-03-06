import type {
  ChartBlock,
  ChatSection,
  MetricBlock,
  ParsedChatResponse,
  TableBlock,
} from "@/types/apis/chat/chat-types/chat-types";

/**
 * Parses the structured markdown format returned by the AI backend:
 *
 * # Summary
 * Some summary text...
 *
 * # Insights
 * * Bullet one
 * * Bullet two
 *
 * # Data
 * ```table
 * { "title": "...", "columns": [...], "rows": [...] }
 * ```
 * ```metric
 * { "label": "...", "value": "..." }
 * ```
 */
export function parseMarkdownResponse(text: string): ParsedChatResponse | null {
  const hasSummary = text.includes("# Summary");
  const hasInsights = text.includes("# Insights");
  const hasData = text.includes("# Data");

  if (!hasSummary && !hasInsights && !hasData) {
    return null;
  }

  // --- Summary section ---
  const summaryMatch = text.match(/# Summary\s*\n([\s\S]*?)(?=\n# |\s*$)/);
  const summary = summaryMatch ? summaryMatch[1].trim() : "";

  // --- Insights section ---
  const insightsMatch = text.match(/# Insights\s*\n([\s\S]*?)(?=\n# |\s*$)/);
  const insights: string[] = [];

  if (insightsMatch) {
    for (const line of insightsMatch[1].split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        insights.push(trimmed.slice(2).trim());
      } else if (trimmed.startsWith("•")) {
        insights.push(trimmed.slice(1).trim());
      }
    }
  }

  // --- Data section ---
  const dataMatch = text.match(/# Data\s*\n([\s\S]*?)(?=\n# |\s*$)/);
  const data: ChatSection[] = [];

  if (dataMatch) {
    const dataText = dataMatch[1];
    const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(dataText)) !== null) {
      const blockType = match[1].toLowerCase();
      const blockContent = match[2].trim();

      try {
        const parsed = JSON.parse(blockContent) as unknown;

        if (blockType === "table") {
          data.push({ type: "table", content: parsed as TableBlock });
        } else if (blockType === "metric") {
          data.push({ type: "metric", content: parsed as MetricBlock });
        } else if (blockType === "chart") {
          data.push({ type: "chart", content: parsed as ChartBlock });
        } else {
          data.push({ type: "text", content: blockContent });
        }
      } catch {
        data.push({ type: "text", content: blockContent });
      }
    }
  }

  // If we found structure, return parsed — even if some sections are empty
  if (!summary && insights.length === 0 && data.length === 0) {
    return null;
  }

  return { summary, insights, data, raw: text };
}
