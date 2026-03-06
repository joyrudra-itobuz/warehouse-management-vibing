"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";

import { useChatStore } from "@/stores/chat";

const { Text } = Typography;

export default function ChatHeader() {
  const resetMessages = useChatStore((state) => state.resetMessages);
  const isStreaming = useChatStore((state) => state.isStreaming);

  function handleNewChat() {
    if (!isStreaming) {
      resetMessages();
    }
  }

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        padding: "10px 14px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        flexShrink: 0,
      }}
    >
      <Text strong style={{ fontSize: 14 }}>
        AI Assistant
      </Text>

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
  );
}
