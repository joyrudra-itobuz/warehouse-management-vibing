import type { ParsedChatResponse } from "@/types/apis/chat/chat-types/chat-types";

export type ChatUIMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  parsed?: ParsedChatResponse;
  status: "done" | "streaming" | "error";
  createdAt: string;
};

export type ChatState = {
  isOpen: boolean;
  activeSessionId: string | null;
  warehouseId: string | null;
  messages: ChatUIMessage[];
  isStreaming: boolean;
  streamingContent: string;
  panelWidth: number;
};

export type ChatActions = {
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  setActiveSession: (id: string | null) => void;
  setWarehouseId: (id: string | null) => void;
  pushMessage: (msg: ChatUIMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  setIsStreaming: (v: boolean) => void;
  setStreamingContent: (text: string) => void;
  appendStreamingChunk: (chunk: string) => void;
  finalizeStreaming: (parsed?: ParsedChatResponse) => void;
  resetMessages: () => void;
  setPanelWidth: (w: number) => void;
};

export type ChatStore = ChatState & ChatActions;
