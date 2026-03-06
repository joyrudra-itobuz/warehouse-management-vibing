"use client";

import { Sender } from "@ant-design/x";
import { RobotOutlined } from "@ant-design/icons";
import { Flex, Select, theme, Typography } from "antd";
import { useState } from "react";

import { useChatStream } from "@/hooks/chat/use-chat-stream/use-chat-stream";
import { useChatModels } from "@/hooks/chat/use-chat-models/use-chat-models";
import { useChatStore } from "@/stores/chat";
import type { ChatHistoryMessage } from "@/types/apis/chat/chat-types/chat-types";

const { Text } = Typography;

export default function ChatSender() {
  const [inputValue, setInputValue] = useState("");
  const { token } = theme.useToken();

  const isStreaming = useChatStore((state) => state.isStreaming);
  const activeSessionId = useChatStore((state) => state.activeSessionId);
  const warehouseId = useChatStore((state) => state.warehouseId);
  const selectedModel = useChatStore((state) => state.selectedModel);
  const setSelectedModel = useChatStore((state) => state.setSelectedModel);
  const messages = useChatStore((state) => state.messages);
  const pushMessage = useChatStore((state) => state.pushMessage);

  const { streamMessage, cancelStream } = useChatStream();
  const { data: models, isLoading: modelsLoading } = useChatModels();

  const modelOptions = (models ?? []).map((m) => ({
    value: m.id,
    label: m.name,
  }));

  function handleSubmit(message: string) {
    if (!message.trim() || isStreaming) {
      return;
    }

    const trimmedMessage = message.trim();
    setInputValue("");

    // Snapshot history BEFORE the optimistic push so it represents only
    // what the LLM has already seen — user + assistant turns only.
    const history: ChatHistoryMessage[] = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .filter((m) => m.status === "done" && m.content.trim() !== "")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

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
      model: selectedModel,
      history: history.length > 0 ? history : undefined,
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
      {/* Model selector — sits just above the text input */}
      <Flex align="center" gap={6} style={{ marginBottom: 6 }}>
        <RobotOutlined
          style={{ fontSize: 12, color: token.colorTextTertiary }}
        />
        <Select
          size="small"
          variant="borderless"
          value={selectedModel}
          onChange={setSelectedModel}
          options={modelOptions}
          loading={modelsLoading}
          disabled={isStreaming}
          placeholder="Select model"
          style={{ flex: 1, fontSize: 12 }}
          popupMatchSelectWidth={false}
          suffixIcon={
            <Text style={{ fontSize: 10, color: token.colorTextTertiary }}>
              model
            </Text>
          }
        />
      </Flex>

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
