export type ChatMessageDto = {
  message: string;
  sessionId?: string;
  warehouseId?: string;
};

export type MetricBlock = {
  label: string;
  value: string;
  change?: string;
  icon?: string;
};

export type TableColumn = {
  key: string;
  label: string;
  type?: string;
};

export type TableBlock = {
  title?: string;
  columns: TableColumn[];
  rows: Record<string, unknown>[];
};

export type ChartBlock = {
  chartType: "bar" | "line" | "pie" | "doughnut" | "area";
  title?: string;
  labels: string[];
  datasets: { label: string; data: number[] }[];
};

export type ChatSection =
  | { type: "text"; content: string }
  | { type: "table"; content: TableBlock }
  | { type: "chart"; content: ChartBlock }
  | { type: "metric"; content: MetricBlock };

export type ParsedChatResponse = {
  summary: string;
  insights: string[];
  data: ChatSection[];
  raw: string;
};

export type ChatApiData = {
  reply: string;
  parsed: ParsedChatResponse;
  sessionId: string;
};

export type ChatApiResponse = {
  success: boolean;
  message: string;
  data: ChatApiData;
};

export type ChatSessionItem = {
  _id: string;
  title: string;
  warehouseContext?: string;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  toolCallId?: string;
  timestamp: string;
};

export type ChatSessionDetail = {
  _id: string;
  userId: string;
  title: string;
  warehouseContext?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

export type ChatSessionsResponse = {
  success: boolean;
  message: string;
  data: ChatSessionItem[];
};

export type ChatSessionDetailResponse = {
  success: boolean;
  message: string;
  data: ChatSessionDetail | null;
};

export type ChatDeleteResponse = {
  success: boolean;
  message: string;
  data: null;
};
