import { create } from "zustand";

import type {
  ChatActions,
  ChatState,
  ChatStore,
  ChatUIMessage,
} from "@/types/stores/chat/chat-store-types/chat-store-types";
import type { ParsedChatResponse } from "@/types/apis/chat/chat-types/chat-types";

const DEFAULT_PANEL_WIDTH = 380;

const initialState: ChatState = {
  isOpen: false,
  activeSessionId: null,
  warehouseId: null,
  messages: [],
  isStreaming: false,
  streamingContent: "",
  panelWidth: DEFAULT_PANEL_WIDTH,
};

export const useChatStore = create<ChatStore>()((set) => ({
  ...initialState,

  toggleChat: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  openChat: () => {
    set({ isOpen: true });
  },

  closeChat: () => {
    set({ isOpen: false });
  },

  setActiveSession: (id: string | null) => {
    set({ activeSessionId: id });
  },

  setWarehouseId: (id: string | null) => {
    set({ warehouseId: id });
  },

  pushMessage: (msg: ChatUIMessage) => {
    set((state) => ({ messages: [...state.messages, msg] }));
  },

  updateLastAssistantMessage: (content: string) => {
    set((state) => {
      const messages = [...state.messages];
      const lastIdx = messages.length - 1;

      if (lastIdx >= 0 && messages[lastIdx].role === "assistant") {
        messages[lastIdx] = { ...messages[lastIdx], content };
      }

      return { messages };
    });
  },

  setIsStreaming: (v: boolean) => {
    set({ isStreaming: v });
  },

  setStreamingContent: (text: string) => {
    set({ streamingContent: text });
  },

  appendStreamingChunk: (chunk: string) => {
    set((state) => ({
      streamingContent: state.streamingContent + chunk,
    }));
  },

  finalizeStreaming: (parsed?: ParsedChatResponse) => {
    set((state) => {
      const messages = [...state.messages];
      const lastIdx = messages.length - 1;

      if (lastIdx >= 0 && messages[lastIdx].role === "assistant") {
        messages[lastIdx] = {
          ...messages[lastIdx],
          content: state.streamingContent,
          parsed,
          status: "done",
        };
      }

      return {
        messages,
        isStreaming: false,
        streamingContent: "",
      };
    });
  },

  resetMessages: () => {
    set({
      messages: [],
      activeSessionId: null,
      isStreaming: false,
      streamingContent: "",
    });
  },

  setPanelWidth: (w: number) => {
    set({ panelWidth: w });
  },
}));
