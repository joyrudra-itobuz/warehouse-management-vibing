"use client";

import { Bubble } from "@ant-design/x";
import type { BubbleListProps } from "@ant-design/x";
import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Typography } from "antd";

import ChatMessageContent from "@/components/ai-chat/chat-message-content/chat-message-content";
import { useChatStore } from "@/stores/chat";
import type { ChatUIMessage } from "@/types/stores/chat/chat-store-types/chat-store-types";

const { Text } = Typography;

function buildBubbleItems(
  messages: ChatUIMessage[],
  isStreaming: boolean,
  streamingContent: string,
): BubbleListProps["items"] {
  return messages.map(function mapMessage(msg) {
    const isStreamingBubble = msg.status === "streaming";
    const content = isStreamingBubble ? streamingContent : msg.content;

    return {
      key: msg.id,
      role: msg.role === "user" ? "user" : "ai",
      content,
      // Show loading dots until some content arrives
      loading: isStreamingBubble && !streamingContent,
      streaming: isStreamingBubble && isStreaming,
      typing: isStreamingBubble
        ? { effect: "typing" as const, step: 2, interval: 30 }
        : false,
    };
  });
}

const roles: BubbleListProps["role"] = {
  ai: {
    placement: "start",
    avatar: (
      <Avatar
        size={28}
        icon={<RobotOutlined />}
        style={{ backgroundColor: "#1677ff", flexShrink: 0 }}
      />
    ),
    contentRender: function renderAiContent(content: unknown) {
      // Content is always the raw accumulated string during streaming
      return (
        <ChatMessageContent content={content as string} parsed={undefined} />
      );
    },
    variant: "borderless",
    shape: "corner",
  },
  user: {
    placement: "end",
    avatar: (
      <Avatar
        size={28}
        icon={<UserOutlined />}
        style={{ backgroundColor: "#87d068", flexShrink: 0 }}
      />
    ),
    variant: "filled",
    shape: "corner",
  },
};

export default function ChatMessageList() {
  const messages = useChatStore((state) => state.messages);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const streamingContent = useChatStore((state) => state.streamingContent);

  const items = buildBubbleItems(messages, isStreaming, streamingContent);

  if (messages.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: 0.5,
          padding: 24,
        }}
      >
        <RobotOutlined style={{ fontSize: 32 }} />
        <Text style={{ fontSize: 13, textAlign: "center" }}>
          Ask me anything about your warehouse
        </Text>
      </div>
    );
  }

  return (
    <Bubble.List
      items={items}
      role={roles}
      autoScroll
      style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}
    />
  );
}
