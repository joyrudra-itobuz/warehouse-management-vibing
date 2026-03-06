import { create } from "zustand";

import type {
  ChatState,
  ChatStore,
  ChatUIMessage,
} from "@/types/stores/chat/chat-store-types/chat-store-types";
import type { ParsedChatResponse } from "@/types/apis/chat/chat-types/chat-types";

const DEFAULT_PANEL_WIDTH = 380;
const WAREHOUSE_ID_KEY = "chat_warehouse_id";
const MODEL_STORAGE_KEY = "chat_selected_model";
const DEFAULT_MODEL = "llama3.1:8b";

const getStoredWarehouseId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(WAREHOUSE_ID_KEY);
};

const getStoredModel = (): string => {
  if (typeof window === "undefined") return DEFAULT_MODEL;
  return localStorage.getItem(MODEL_STORAGE_KEY) ?? DEFAULT_MODEL;
};

const persistWarehouseId = (id: string | null): void => {
  if (typeof window === "undefined") return;
  if (id) {
    localStorage.setItem(WAREHOUSE_ID_KEY, id);
  } else {
    localStorage.removeItem(WAREHOUSE_ID_KEY);
  }
};

const initialState: ChatState = {
  isOpen: false,
  activeSessionId: null,
  warehouseId: getStoredWarehouseId(),
  selectedModel: getStoredModel(),
  messages: [],
  isStreaming: false,
  streamingContent: "",
  streamingParsed: undefined,
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
    persistWarehouseId(id);
    set({ warehouseId: id });
  },

  setSelectedModel: (model: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(MODEL_STORAGE_KEY, model);
    }
    set({ selectedModel: model });
  },

  setStreamingParsed: (parsed) => {
    set({ streamingParsed: parsed });
  },

  pushMessage: (msg: ChatUIMessage) => {
    set((state) => ({ messages: [...state.messages, msg] }));
  },

  setMessages: (msgs: ChatUIMessage[]) => {
    set({ messages: msgs });
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
        streamingParsed: undefined,
      };
    });
  },

  resetMessages: () => {
    set({
      messages: [],
      activeSessionId: null,
      isStreaming: false,
      streamingContent: "",
      streamingParsed: undefined,
    });
  },

  setPanelWidth: (w: number) => {
    set({ panelWidth: w });
  },
}));
