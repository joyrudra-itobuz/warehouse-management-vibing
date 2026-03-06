import { useQuery } from "@tanstack/react-query";

import chatRoutes from "@/lib/apis/routes/chat-routes";
import { CHAT_SESSIONS_QUERY_KEY } from "@/hooks/chat/use-chat-sessions/use-chat-sessions";

export function chatSessionDetailQueryKey(sessionId: string) {
  return [...CHAT_SESSIONS_QUERY_KEY, sessionId] as const;
}

type UseChatSessionDetailOptions = {
  sessionId: string | null;
  enabled?: boolean;
};

export function useChatSessionDetail({
  sessionId,
  enabled = true,
}: UseChatSessionDetailOptions) {
  return useQuery({
    queryKey: chatSessionDetailQueryKey(sessionId ?? ""),
    queryFn: function fetchChatSessionDetail() {
      return chatRoutes.getSession(sessionId!);
    },
    enabled: enabled && Boolean(sessionId),
    staleTime: 0,
  });
}
