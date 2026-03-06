import { useQuery } from "@tanstack/react-query";

import chatRoutes from "@/lib/apis/routes/chat-routes";

export const CHAT_SESSIONS_QUERY_KEY = ["chat", "sessions"] as const;

type UseChatSessionsOptions = {
  enabled?: boolean;
};

export function useChatSessions({
  enabled = true,
}: UseChatSessionsOptions = {}) {
  return useQuery({
    queryKey: CHAT_SESSIONS_QUERY_KEY,
    queryFn: function fetchChatSessions() {
      return chatRoutes.getSessions();
    },
    enabled,
    staleTime: 30_000,
  });
}
