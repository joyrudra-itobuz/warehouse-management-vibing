"use client";

import { Sender } from "@ant-design/x";
import { theme } from "antd";
import { useState } from "react";

import { useChatStream } from "@/hooks/chat/use-chat-stream/use-chat-stream";
import { useChatStore } from "@/stores/chat";

export default function ChatSender() {
  const [inputValue, setInputValue] = useState("");
  const { token } = theme.useToken();

  const isStreaming = useChatStore((state) => state.isStreaming);
  const activeSessionId = useChatStore((state) => state.activeSessionId);
  const warehouseId = useChatStore((state) => state.warehouseId);
  const pushMessage = useChatStore((state) => state.pushMessage);

  const { streamMessage, cancelStream } = useChatStream();

  function handleSubmit(message: string) {
    if (!message.trim() || isStreaming) {
      return;
    }

    const trimmedMessage = message.trim();
    setInputValue("");

    // Optimistically add user bubble
    pushMessage({
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedMessage,
      status: "done",
      createdAt: new Date().toISOString(),
    });

    streamMessage({
      message: trimmedMessage,
      sessionId: activeSessionId ?? undefined,
      warehouseId: warehouseId ?? undefined,
    });
  }

  function handleCancel() {
    cancelStream();
  }

  return (
    <div
      style={{
        padding: "8px 12px 12px",
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        flexShrink: 0,
      }}
    >
      <Sender
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={isStreaming}
        placeholder="Ask about your warehouse..."
        autoSize={{ minRows: 1, maxRows: 4 }}
        submitType="enter"
      />
    </div>
  );
}
