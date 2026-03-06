"use client";

import { Conversations } from "@ant-design/x";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ConversationsProps } from "@ant-design/x";
import { Button, Flex, Spin, Typography } from "antd";

import { useChatSessions } from "@/hooks/chat/use-chat-sessions/use-chat-sessions";
import { useDeleteChatSession } from "@/hooks/chat/use-delete-chat-session/use-delete-chat-session";
import { useChatStore } from "@/stores/chat";

const { Text } = Typography;

export default function ChatSessionList() {
  const activeSessionId = useChatStore((state) => state.activeSessionId);
  const isOpen = useChatStore((state) => state.isOpen);
  const setActiveSession = useChatStore((state) => state.setActiveSession);
  const resetMessages = useChatStore((state) => state.resetMessages);

  const { data, isLoading } = useChatSessions({ enabled: isOpen });
  const { mutate: deleteSession, isPending: isDeleting } =
    useDeleteChatSession();

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
    setActiveSession(sessionId);
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
  );
}
