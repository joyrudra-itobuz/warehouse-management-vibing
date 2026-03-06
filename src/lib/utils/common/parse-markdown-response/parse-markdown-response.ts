import type {
  ChartBlock,
  ChatSection,
  MetricBlock,
  ParsedChatResponse,
  TableBlock,
} from "@/types/apis/chat/chat-types/chat-types";

/**
 * Parses ONE structured block (# Summary / # Insights / # Data).
 * Returns null when the block has no recognisable content.
 */
function parseSingleBlock(text: string): ParsedChatResponse | null {
  const hasSummary = text.includes("# Summary");
  const hasInsights = text.includes("# Insights");
  const hasData = text.includes("# Data");

  if (!hasSummary && !hasInsights && !hasData) return null;

  // --- Summary ---
  const summaryMatch = text.match(/# Summary\s*\n([\s\S]*?)(?=\n# |\s*$)/);
  const summary = summaryMatch ? summaryMatch[1].trim() : "";

  // --- Insights ---
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

  // --- Data blocks ---
  const dataMatch = text.match(/# Data\s*\n([\s\S]*?)(?=\n# |\s*$)/);
  const data: ChatSection[] = [];

  if (dataMatch) {
    const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
    let match: RegExpExecArray | null;
    while ((match = codeBlockRegex.exec(dataMatch[1])) !== null) {
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

  if (!summary && insights.length === 0 && data.length === 0) return null;
  return { summary, insights, data, raw: text };
}

/**
 * Entry point — may be called on every streaming chunk for progressive
 * rendering, so it must never throw and must tolerate partial JSON
 * (incomplete code-fences are simply skipped by the regex).
 *
 * The LLM often emits multiple intermediate `# Summary … # Data` blocks
 * (with empty rows/datasets) while it calls tools, before the final,
 * fully-populated answer. We split on those boundaries, walk backwards,
 * and return the LAST block that has real content — which is always the
 * richest one.
 */
export function parseMarkdownResponse(text: string): ParsedChatResponse | null {
  if (
    !text.includes("# Summary") &&
    !text.includes("# Insights") &&
    !text.includes("# Data")
  ) {
    return null;
  }

  // Split so each segment starts at a "# Summary" heading.
  // Text before the first heading becomes segment[0] and is skipped.
  const segments = text.split(/(?=^# Summary\b)/m);

  for (let i = segments.length - 1; i >= 0; i--) {
    const result = parseSingleBlock(segments[i]);
    if (
      result &&
      (result.data.length > 0 ||
        result.summary.length > 0 ||
        result.insights.length > 0)
    ) {
      return result;
    }
  }

  return null;
}
