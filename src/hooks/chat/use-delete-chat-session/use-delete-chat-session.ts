import { useMutation, useQueryClient } from "@tanstack/react-query";

import chatRoutes from "@/lib/apis/routes/chat-routes";
import { CHAT_SESSIONS_QUERY_KEY } from "@/hooks/chat/use-chat-sessions/use-chat-sessions";
import { useChatStore } from "@/stores/chat";

export function useDeleteChatSession() {
  const queryClient = useQueryClient();
  const activeSessionId = useChatStore((state) => state.activeSessionId);
  const setActiveSession = useChatStore((state) => state.setActiveSession);
  const resetMessages = useChatStore((state) => state.resetMessages);

  return useMutation({
    mutationFn: function deleteChatSession(sessionId: string) {
      return chatRoutes.deleteSession(sessionId);
    },
    onSuccess: function onDeleteSuccess(_data, sessionId) {
      // If the deleted session was the active one, reset the chat
      if (sessionId === activeSessionId) {
        setActiveSession(null);
        resetMessages();
      }

      queryClient.invalidateQueries({ queryKey: CHAT_SESSIONS_QUERY_KEY });
    },
  });
}
