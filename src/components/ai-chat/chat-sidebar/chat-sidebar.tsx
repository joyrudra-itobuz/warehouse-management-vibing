"use client";

import { XProvider } from "@ant-design/x";
import { Collapse } from "antd";

import ChatHeader from "@/components/ai-chat/chat-header/chat-header";
import ChatMessageList from "@/components/ai-chat/chat-message-list/chat-message-list";
import ChatSender from "@/components/ai-chat/chat-sender/chat-sender";
import ChatSessionList from "@/components/ai-chat/chat-session-list/chat-session-list";

export default function ChatSidebar() {
  return (
    <XProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          borderLeft: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <ChatHeader />

        {/* Session history (collapsible) */}
        <Collapse
          ghost
          size="small"
          defaultActiveKey={[]}
          style={{ flexShrink: 0, borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          items={[
            {
              key: "sessions",
              label: "Chat history",
              children: (
                <div
                  style={{
                    maxHeight: 200,
                    overflowY: "auto",
                    paddingBottom: 4,
                  }}
                >
                  <ChatSessionList />
                </div>
              ),
            },
          ]}
        />

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
