"use client";

import { Conversations } from "@ant-design/x";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ConversationsProps } from "@ant-design/x";
import { Button, Flex, Spin, Typography } from "antd";
import { useEffect, useRef, useState } from "react";

import { useChatSessionDetail } from "@/hooks/chat/use-chat-session-detail/use-chat-session-detail";
import { useChatSessions } from "@/hooks/chat/use-chat-sessions/use-chat-sessions";
import { useDeleteChatSession } from "@/hooks/chat/use-delete-chat-session/use-delete-chat-session";
import { parseMarkdownResponse } from "@/lib/utils/common/parse-markdown-response/parse-markdown-response";
import { useChatStore } from "@/stores/chat";
import type { ChatUIMessage } from "@/types/stores/chat/chat-store-types/chat-store-types";

const { Text } = Typography;

export default function ChatSessionList() {
  const activeSessionId = useChatStore((state) => state.activeSessionId);
  const isOpen = useChatStore((state) => state.isOpen);
  const setActiveSession = useChatStore((state) => state.setActiveSession);
  const resetMessages = useChatStore((state) => state.resetMessages);
  const setMessages = useChatStore((state) => state.setMessages);

  // Track which session the user manually clicked to load
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);
  const loadedSessionRef = useRef<string | null>(null);

  const { data, isLoading } = useChatSessions({ enabled: isOpen });
  const { mutate: deleteSession, isPending: isDeleting } =
    useDeleteChatSession();

  // Fetch the session detail when user clicks a session from history
  const { data: sessionDetail, isFetching: isFetchingDetail } =
    useChatSessionDetail({
      sessionId: loadingSessionId,
      enabled: Boolean(loadingSessionId),
    });

  // When session detail loads, convert to ChatUIMessage[] and push into store
  useEffect(() => {
    if (!sessionDetail?.data || !loadingSessionId) return;
    // Prevent re-loading the same session
    if (loadedSessionRef.current === loadingSessionId) return;
    loadedSessionRef.current = loadingSessionId;

    const uiMessages: ChatUIMessage[] = sessionDetail.data.messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m, idx) => ({
        id: `${m.role}-history-${idx}`,
        role: m.role as "user" | "assistant",
        content: m.content,
        parsed:
          m.role === "assistant"
            ? (parseMarkdownResponse(m.content) ?? undefined)
            : undefined,
        status: "done" as const,
        createdAt: m.timestamp,
      }));

    setMessages(uiMessages);
  }, [sessionDetail, loadingSessionId, setMessages]);

  const sessions = data?.data ?? [];

  const conversationItems: ConversationsProps["items"] = sessions.map(
    function mapSession(session) {
      return {
        key: session._id,
        label: session.title || "Untitled chat",
      };
    },
  );

  function handleNewChat() {
    resetMessages();
  }

  function handleSessionChange(sessionId: string) {
    if (sessionId === activeSessionId) return; // already on this session
    setActiveSession(sessionId);
    resetMessages(); // clear current messages while we load
    setLoadingSessionId(sessionId); // trigger the detail fetch
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ padding: "16px 0" }}>
        <Spin size="small" />
      </Flex>
    );
  }

  if (sessions.length === 0) {
    return (
      <Flex
        vertical
        align="center"
        gap={8}
        style={{ padding: "12px 8px", opacity: 0.6 }}
      >
        <Text style={{ fontSize: 12 }}>No conversations yet</Text>
        <Button
          size="small"
          icon={<PlusOutlined />}
          onClick={handleNewChat}
          type="dashed"
        >
          Start chat
        </Button>
      </Flex>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {isFetchingDetail ? (
        <Flex
          justify="center"
          align="center"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background: "rgba(0,0,0,0.05)",
            borderRadius: 4,
          }}
        >
          <Spin size="small" />
        </Flex>
      ) : null}

      <Conversations
        items={conversationItems}
        activeKey={activeSessionId ?? undefined}
        onActiveChange={handleSessionChange}
        menu={function getMenu(conversation) {
          return {
            items: [
              {
                key: "delete",
                label: "Delete",
                icon: <DeleteOutlined />,
                danger: true,
              },
            ],
            onClick: function onMenuClick({ key }) {
              if (key === "delete") {
                deleteSession(conversation.key);
              }
            },
            disabled: isDeleting,
          };
        }}
        style={{ padding: "0 4px" }}
      />
    </div>
  );
}
