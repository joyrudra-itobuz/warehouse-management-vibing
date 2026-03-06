"use client";

import { Bubble } from "@ant-design/x";
import type { BubbleListProps } from "@ant-design/x";
import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, theme, Typography } from "antd";

import ChatMessageContent from "@/components/ai-chat/chat-message-content/chat-message-content";
import { useChatStore } from "@/stores/chat";
import type { ChatUIMessage } from "@/types/stores/chat/chat-store-types/chat-store-types";

const { Text } = Typography;

// Accent green matching the app brand (vault logo color)
const USER_BUBBLE_BG = "#D6F247";
const USER_BUBBLE_TEXT = "#1a1a1a";

export default function ChatMessageList() {
  const { token } = theme.useToken();
  const messages = useChatStore((state) => state.messages);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const streamingContent = useChatStore((state) => state.streamingContent);
  const streamingParsed = useChatStore((state) => state.streamingParsed);

  const items: BubbleListProps["items"] = messages.map(function mapMessage(
    msg: ChatUIMessage,
  ) {
    const isStreamingBubble = msg.status === "streaming";
    const content = isStreamingBubble ? streamingContent : msg.content;
    // During streaming, use the progressively-parsed result so formatted
    // blocks (tables, charts, metrics) render as they arrive rather than
    // only after the stream is fully complete.
    const parsed = isStreamingBubble ? streamingParsed : msg.parsed;

    return {
      key: msg.id,
      role: msg.role === "user" ? "user" : "ai",
      content,
      loading: isStreamingBubble && !streamingContent,
      streaming: isStreamingBubble && isStreaming,
      typing: isStreamingBubble
        ? { effect: "typing" as const, step: 2, interval: 30 }
        : false,
      contentRender:
        msg.role === "user"
          ? function renderUser(c: unknown) {
              return (
                <div
                  style={{
                    background: USER_BUBBLE_BG,
                    color: USER_BUBBLE_TEXT,
                    borderRadius: 10,
                    padding: "8px 12px",
                    fontSize: 13,
                    lineHeight: 1.6,
                    wordBreak: "break-word",
                  }}
                >
                  {c as string}
                </div>
              );
            }
          : function renderAi(c: unknown) {
              return (
                <div
                  style={{
                    background: token.colorFillSecondary,
                    borderRadius: 10,
                    padding: "8px 12px",
                  }}
                >
                  <ChatMessageContent content={c as string} parsed={parsed} />
                </div>
              );
            },
    };
  });

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
      variant: "borderless",
      shape: "corner",
    },
  };

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
