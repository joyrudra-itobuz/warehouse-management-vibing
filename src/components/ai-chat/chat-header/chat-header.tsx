"use client";

import { HistoryOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, theme, Typography } from "antd";
import { useState } from "react";

import ChatSessionList from "@/components/ai-chat/chat-session-list/chat-session-list";
import { useChatStore } from "@/stores/chat";

const { Text } = Typography;

export default function ChatHeader() {
  const { token } = theme.useToken();
  const resetMessages = useChatStore((state) => state.resetMessages);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const [historyOpen, setHistoryOpen] = useState(false);

  function handleNewChat() {
    if (!isStreaming) {
      resetMessages();
    }
  }

  return (
    <div style={{ flexShrink: 0 }}>
      {/* Title row */}
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "10px 14px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text strong style={{ fontSize: 14 }}>
          AI Assistant
        </Text>

        <Flex gap={6}>
          <Button
            size="small"
            icon={<HistoryOutlined />}
            onClick={() => setHistoryOpen((prev) => !prev)}
            type={historyOpen ? "primary" : "default"}
            title="Toggle chat history"
          />
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={handleNewChat}
            disabled={isStreaming}
            title="New chat"
          >
            New chat
          </Button>
        </Flex>
      </Flex>

      {/* Collapsible session history */}
      {historyOpen ? (
        <div
          style={{
            maxHeight: 220,
            overflowY: "auto",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <ChatSessionList />
        </div>
      ) : null}
    </div>
  );
}
