"use client";

import { XProvider } from "@ant-design/x";
import { theme } from "antd";

import ChatHeader from "@/components/ai-chat/chat-header/chat-header";
import ChatMessageList from "@/components/ai-chat/chat-message-list/chat-message-list";
import ChatSender from "@/components/ai-chat/chat-sender/chat-sender";

export default function ChatSidebar() {
  const { token } = theme.useToken();

  return (
    <XProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          borderLeft: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {/* Header with session list */}
        <ChatHeader />

        {/* Messages — takes remaining height */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChatMessageList />
        </div>

        {/* Chat input — pinned to bottom */}
        <ChatSender />
      </div>
    </XProvider>
  );
}
